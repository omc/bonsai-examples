import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';
import { MovieEntity } from '../entities/movie.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SortMovieDto } from '../../../../dto/query-movie.dto';
import { Movie } from '../../../../domain/movie';
import { MovieRepository } from '../../movieRepository';
import { MovieMapper } from '../mappers/movie.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class MoviesRelationalRepository implements MovieRepository {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly moviesRepository: Repository<MovieEntity>,
  ) {}

  async create(data: { title: string }): Promise<Movie> {
    const persistenceModel = MovieMapper.toPersistence(data);
    const newEntity = await this.moviesRepository.save(
      this.moviesRepository.create(persistenceModel),
    );
    return MovieMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortMovieDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Movie[]> {
    const where: FindOptionsWhere<MovieEntity> = {};

    const entities = await this.moviesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((movie) => MovieMapper.toDomain(movie));
  }

  async findById(id: Movie['id']): Promise<NullableType<Movie>> {
    const entity = await this.moviesRepository.findOne({
      where: { id: Number(id) },
    });

    return entity ? MovieMapper.toDomain(entity) : null;
  }

  async findByTitle(title: Movie['title']): Promise<NullableType<Movie>> {
    if (!title) return null;

    const entity = await this.moviesRepository.findOne({
      where: { title },
    });

    return entity ? MovieMapper.toDomain(entity) : null;
  }

  async update(id: Movie['id'], payload: Partial<Movie>): Promise<Movie> {
    const entity = await this.moviesRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Movie not found');
    }

    const updatedEntity = await this.moviesRepository.save(
      this.moviesRepository.create(
        MovieMapper.toPersistence({
          ...MovieMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return MovieMapper.toDomain(updatedEntity);
  }

  async remove(id: Movie['id']): Promise<void> {
    await this.moviesRepository.softDelete(id);
  }
}
