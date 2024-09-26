import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import databaseConfig from './database/config/database.config';
import searchConfig from './database/config/search.config';
import appConfig from './config/app.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { HomeModule } from './home/home.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SearchModule } from './database/search/search.module';

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    return new DataSource(options).initialize();
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, searchConfig, appConfig],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    MoviesModule,
    HomeModule,
    SearchModule,
  ],
})
export class AppModule {}
