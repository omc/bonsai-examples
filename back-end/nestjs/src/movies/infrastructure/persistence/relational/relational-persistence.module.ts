import { Module } from '@nestjs/common';
import { MovieRepository } from '../movie.repository';
import { MoviesRelationalRepository } from './repositories/movie.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity])],
  providers: [
    {
      provide: MovieRepository,
      useClass: MoviesRelationalRepository,
    },
  ],
  exports: [MovieRepository],
})
export class RelationalMoviePersistenceModule {}
