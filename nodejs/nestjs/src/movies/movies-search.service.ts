import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { WriteResponseBase } from '@elastic/elasticsearch/lib/api/types';
import { MovieEntity } from './infrastructure/persistence/relational/entities/movie.entity';
import { MovieSearchDocument } from './interfaces/movie-search-document.interface';

@Injectable()
export class MoviesSearchService {
  index = 'movies';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexMovie(movie: MovieEntity): Promise<WriteResponseBase> {
    return await this.elasticsearchService.index<MovieSearchDocument>({
      index: this.index,
      document: {
        id: movie.id,
        title: movie.title,
      },
    });
  }

  async count(query: string, fields: string[]) {
    const { count } = await this.elasticsearchService.count({
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
    return count;
  }

  async search(text: string, offset?: number, limit?: number, startId = 0) {
    let separateCount = 0;
    if (startId) {
      separateCount = await this.count(text, ['title']);
    }
    const { hits } =
      await this.elasticsearchService.search<MovieSearchDocument>({
        index: this.index,
        from: offset,
        size: limit,
        query: {
          bool: {
            should: {
              multi_match: {
                query: text,
                fields: ['title'],
              },
            },
            filter: {
              range: {
                id: {
                  gt: startId,
                },
              },
            },
          },
        },
      });
    const count = hits.total;
    const results = hits.hits.map((item) => item._source);
    return {
      count: startId ? separateCount : count,
      results,
    };
  }
}
