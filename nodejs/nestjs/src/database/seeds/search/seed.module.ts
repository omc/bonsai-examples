import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MovieSeedModule } from './movie/movie-seed.module';
import appConfig from '../../../config/app.config';
import searchConfig from '../../config/search.config';
import databaseConfig from '../../config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    MovieSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, searchConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class SeedModule {}
