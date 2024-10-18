import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { Movie } from '../domain/movie';

export enum SearchTarget {
  Title = 'title',
  Script = 'script',
}

export class SortMovieDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Movie;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryMovieDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 0))
  @Type(() => Number)
  @Min(0)
  @IsNumber()
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  startId?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortMovieDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortMovieDto)
  sort?: SortMovieDto[] | null;

  @ApiProperty({
    type: [String],
    default: [SearchTarget.Title],
    required: false,
  })
  @IsEnum(SearchTarget, { each: true })
  @IsOptional()
  @IsArray()
  targets: SearchTarget[];
}
