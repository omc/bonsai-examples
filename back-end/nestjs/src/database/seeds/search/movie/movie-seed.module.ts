import { Module } from '@nestjs/common';

import { MovieSeedService } from './movie-seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from '../../../../movies/infrastructure/persistence/relational/entities/movie.entity';
import { MoviesModule } from '../../../../movies/movies.module';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity]), MoviesModule],
  providers: [MovieSeedService],
  exports: [MovieSeedService],
})
export class MovieSeedModule {}
