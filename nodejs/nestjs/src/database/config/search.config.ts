import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { ElasticsearchModuleAsyncOptions } from '@nestjs/elasticsearch';

import { IsOptional, IsString, ValidateIf } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { SearchConfig } from './search-config.type';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => !envValues.ELASTICSEARCH_NODE)
  @IsString()
  ELASTICSEARCH_NODE: string;

  @IsString()
  @IsOptional()
  ELASTICSEARCH_PASSWORD: string;

  @IsString()
  @IsOptional()
  ELASTICSEARCH_USERNAME: string;
}

export const elasticSearchModuleOptions: ElasticsearchModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const username = configService.get('elasticSearch.auth.username', {
      infer: true,
    });
    const opts = {
      node: configService.get('elasticSearch.node', { infer: true }),
    };

    if (username) {
      const authOpts = {
        auth: {
          username: username,
          password: configService.get('elasticSearch.auth.password', {
            infer: true,
          }),
        },
      };
      return { ...opts, ...authOpts };
    }
    return opts;
  },
};

export default registerAs<SearchConfig>('elasticSearch', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    node: process.env.ELASTICSEARCH_NODE,
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD,
    },
  };
});
