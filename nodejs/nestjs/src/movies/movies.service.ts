import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { NullableType } from '../utils/types/nullable.type';
import { SearchTarget, SortMovieDto } from './dto/query-movie.dto';
import { MovieRepository } from './infrastructure/persistence/movie.repository';
import { Movie } from './domain/movie';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { MoviesSearchService } from './movies-search.service';
import { In } from 'typeorm';

@Injectable()
export class MoviesService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly moviesSearchService: MoviesSearchService,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const clonedPayload = {
      ...createMovieDto,
    };

    if (clonedPayload.title) {
      const movieObject = await this.movieRepository.findByTitle(
        clonedPayload.title,
      );
      if (movieObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            title: 'titleAlreadyExists',
          },
        });
      }
    }

    return this.movieRepository.create(clonedPayload);
  }

  async search(
    text: string,
    targets: SearchTarget[],
    offset?: number,
    limit?: number,
    startId?: number,
  ) {
    const { results, count } = await this.moviesSearchService.search(
      text,
      targets,
      offset,
      limit,
      startId,
    );
    const ids = results.map((result) => result?.id);
    if (!ids.length) {
      return {
        data: [],
        count,
      };
    }
    const data = await this.movieRepository.find({
      where: { id: In(ids) },
    });

    return {
      data,
      count,
    };
  }

  findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortMovieDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Movie[]> {
    return this.movieRepository.findManyWithPagination({
      sortOptions,
      paginationOptions,
    });
  }

  findById(id: Movie['id']): Promise<NullableType<Movie>> {
    return this.movieRepository.findById(id);
  }

  findByTitle(title: Movie['title']): Promise<NullableType<Movie>> {
    return this.movieRepository.findByTitle(title);
  }

  async update(
    id: Movie['id'],
    payload: DeepPartial<Movie>,
  ): Promise<Movie | null> {
    const clonedPayload = { ...payload };

    if (clonedPayload.title) {
      const movieObject = await this.movieRepository.findByTitle(
        clonedPayload.title,
      );

      if (movieObject && movieObject.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            title: 'titleAlreadyExists',
          },
        });
      }
    }

    return this.movieRepository.update(id, clonedPayload);
  }

  async remove(id: Movie['id']): Promise<void> {
    await this.movieRepository.remove(id);
  }
}
