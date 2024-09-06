import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Movie } from '../../domain/movie';

import { SortMovieDto } from '../../dto/query-movie.dto';

export abstract class MovieRepository {
  abstract create(data: { title: string }): Promise<Movie>;

  abstract findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortMovieDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Movie[]>;

  abstract findById(id: Movie['id']): Promise<NullableType<Movie>>;
  abstract findByTitle(title: Movie['title']): Promise<NullableType<Movie>>;

  abstract update(
    id: Movie['id'],
    payload: DeepPartial<Movie>,
  ): Promise<Movie | null>;

  abstract remove(id: Movie['id']): Promise<void>;
}
