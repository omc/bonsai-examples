import { Module } from '@nestjs/common';

import { MoviesController } from './movies.controller';

import { MoviesService } from './movies.service';
import { RelationalMoviePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { SearchModule } from '../database/search/search.module';
import { MoviesSearchService } from './movies-search.service';

const infrastructurePersistenceModule = RelationalMoviePersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, SearchModule],
  controllers: [MoviesController],
  providers: [MoviesService, MoviesSearchService],
  exports: [
    MoviesService,
    infrastructurePersistenceModule,
    MoviesSearchService,
  ],
})
export class MoviesModule {}
