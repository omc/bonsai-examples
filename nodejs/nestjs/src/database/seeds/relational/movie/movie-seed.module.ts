import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MovieSeedService } from './movie-seed.service';
import { MovieEntity } from '../../../../movies/infrastructure/persistence/relational/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity])],
  providers: [MovieSeedService],
  exports: [MovieSeedService],
})
export class MovieSeedModule {}
