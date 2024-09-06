import { Module } from '@nestjs/common';

import { MoviesController } from './movies.controller';

import { MoviesService } from './movies.service';
import { RelationalMoviePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalMoviePersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService, infrastructurePersistenceModule],
})
export class MoviesModule {}
