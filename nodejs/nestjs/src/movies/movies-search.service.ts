import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { RequestParams } from '@elastic/elasticsearch';
import { MovieEntity } from './infrastructure/persistence/relational/entities/movie.entity';
import { ApiResponse, Context } from '@elastic/elasticsearch/lib/Transport';
import { MovieSearchDocument } from './interfaces/movie-search-document.interface';
import OpenAI from 'openai';
import { SearchTarget } from './dto/query-movie.dto';
import Groq from 'groq-sdk';

@Injectable()
export class MoviesSearchService {
  index = 'movies';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async existsIndex(): Promise<ApiResponse> {
    const request: RequestParams.IndicesExists = {
      index: this.index,
    };
    return this.elasticsearchService.indices.exists(request);
  }

  async statusIndex(): Promise<ApiResponse> {
    const request: RequestParams.ClusterHealth = {
      index: this.index,
    };
    return this.elasticsearchService.cluster.health(request);
  }

  async createIndex(): Promise<ApiResponse> {
    const request: RequestParams.IndicesCreate = {
      body: {
        settings: {
          'index.knn': true,
          number_of_shards: 1,
          number_of_replicas: 1, // for local development
        },
        mappings: {
          properties: {
            id: {
              type: 'text',
            },
            title: {
              type: 'text',
            },
            script: {
              type: 'text',
            },
            script_embedding_vector: {
              type: 'knn_vector',
              dimension: 1536,
              method: {
                engine: 'nmslib',
                space_type: 'l2',
                name: 'hnsw',
                parameters: {
                  ef_construction: 128,
                  m: 24,
                },
              },
            },
          },
        },
      },
      index: this.index,
    };
    return this.elasticsearchService.indices.create(request);
  }

  async deleteIndex(): Promise<ApiResponse> {
    const request: RequestParams.IndicesDelete = {
      index: this.index,
    };
    return this.elasticsearchService.indices.delete(request);
  }

  async indexMovies(movies: MovieEntity[]): Promise<ApiResponse> {
    const idx = this.index;
    const body = movies.flatMap((movie) => {
      const doc: MovieSearchDocument = {
        id: movie.id,
        title: movie.title,
        script: movie.script,
        script_embedding_vector: movie.script_embedding_vector,
      };
      return [{ index: { _index: idx } }, doc];
    });
    const request: RequestParams.Bulk = {
      refresh: true,
      body,
    };
    return this.elasticsearchService.bulk(request);
  }

  async count(query: string, fields: string[]) {
    const {
      body: result,
    }: ApiResponse<
      Record<string, number>,
      Context
    > = await this.elasticsearchService.count({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query,
            fields,
          },
        },
      },
    });
    return result.count;
  }

  async search(
    text: string,
    targets: string[],
    offset?: number,
    limit?: number,
    startId = 0,
  ) {
    let separateCount = 0;
    if (startId) {
      separateCount = await this.count(text, targets);
    }

    // Default query handling is to perform a text query
    let query: Record<string, any> = {
      multi_match: {
        query: text,
        fields: targets,
      },
    };

    // If this is a query targeting the script embedding vector, adjust
    // the query accordingly!
    if (
      targets.length === 1 &&
      targets.includes(SearchTarget.ScriptEmbeddingVector)
    ) {
      const client = new Groq({
        apiKey: process.env.GROQ_API_KEY,
      });

      query = {
        knn: {},
      };

      query['knn'][SearchTarget.ScriptEmbeddingVector] = {
        vector: await this.generateQueryEmbeddings(client, text),
        k: 5,
      };
    }
    const params: RequestParams.Search = {
      index: this.index,
      from: offset,
      size: limit,
      _source_excludes: [
        SearchTarget.Script,
        SearchTarget.ScriptEmbeddingVector,
      ],
      body: {
        query: query,
      },
    };
    const { body: result } = await this.elasticsearchService.search(params);
    const count = result.hits.total.value;
    const results = result.hits.hits.map((item) => item._source);
    return {
      count: startId ? separateCount : count,
      results,
    };
  }

  async generateQueryEmbeddings(
    client: Groq,
    query: string,
    numCharsAllowed: number = 15000,
  ): Promise<number[] | null> {
    const query_embedding = await client.embeddings.create({
      model: 'llama3-groq-70b-8192-tool-use-preview',
      input: query.slice(0, numCharsAllowed),
      encoding_format: 'float',
    });

    // We're only requesting one embedding; so there should only be one entry!
    if (query_embedding !== undefined && query_embedding.data.length === 1) {
      return Promise.resolve(query_embedding.data[0].embedding as number[]);
    }
    return Promise.resolve(null);
  }
}
