import { registerAs } from '@nestjs/config';

import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { SearchConfig } from './search-config.type';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsInt()
  @Min(0)
  @Max(65535)
  ELASTICSEARCH_NODE: number;

  @IsString()
  @IsOptional()
  ELASTICSEARCH_PASSWORD: string;

  @IsString()
  @IsOptional()
  ELASTICSEARCH_USERNAME: string;
}

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
