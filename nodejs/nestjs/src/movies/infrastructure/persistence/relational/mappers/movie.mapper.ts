import { Movie } from '../../../../domain/movie';
import { MovieEntity } from '../entities/movie.entity';

export class MovieMapper {
  static toDomain(raw: MovieEntity): Movie {
    const domainEntity = new Movie();
    domainEntity.id = raw.id;
    domainEntity.title = raw.title;

    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: {
    id?: number;
    title: string;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }): MovieEntity {
    const persistenceEntity = new MovieEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.title = domainEntity.title;

    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;
    return persistenceEntity;
  }
}
