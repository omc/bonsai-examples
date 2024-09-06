import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MovieSeedModule } from './movie/movie-seed.module';
import appConfig from '../../../config/app.config';
import searchConfig from '../../config/search.config';

@Module({
  imports: [
    MovieSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [searchConfig, appConfig],
      envFilePath: ['.env'],
    }),
  ],
})
export class SeedModule {}
