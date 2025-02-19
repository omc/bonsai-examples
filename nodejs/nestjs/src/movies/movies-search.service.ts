import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { RequestParams } from '@elastic/elasticsearch';
import { MovieEntity } from './infrastructure/persistence/relational/entities/movie.entity';
import { ApiResponse, Context } from '@elastic/elasticsearch/lib/Transport';
import { MovieSearchDocument } from './interfaces/movie-search-document.interface';

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
          index: {
            number_of_shards: 1,
            number_of_replicas: 1, // for local development
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
      const doc: MovieSearchDocument = { id: movie.id, title: movie.title };
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

  async search(text: string, offset?: number, limit?: number, startId = 0) {
    let separateCount = 0;
    if (startId) {
      separateCount = await this.count(text, ['title']);
    }
    const params: RequestParams.Search = {
      index: this.index,
      from: offset,
      size: limit,
      body: {
        query: {
          match: {
            title: text,
          },
        },
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
}
