import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class SearchResponseDto<T> {
  @ApiProperty()
  @IsArray()
  data: T[];

  @ApiProperty()
  @IsNumber()
  count: number;
}
