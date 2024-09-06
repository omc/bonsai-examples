import { Module } from '@nestjs/common';

import { MovieSeedService } from './movie-seed.service';
import { elasticSearchModuleOptions } from '../../../config/search.config';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { MoviesSearchService } from '../../../../movies/movies-search.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from '../../../../movies/infrastructure/persistence/relational/entities/movie.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieEntity]),
    ConfigModule,
    ElasticsearchModule.registerAsync(elasticSearchModuleOptions),
  ],
  providers: [MovieSeedService, MoviesSearchService],
  exports: [MovieSeedService],
})
export class MovieSeedModule {}
