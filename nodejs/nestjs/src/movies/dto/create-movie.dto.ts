import { ApiProperty } from '@nestjs/swagger';
import {
  // decorators here
  IsNotEmpty,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'The Fifth Element', type: String })
  @IsNotEmpty()
  title: string;
}
