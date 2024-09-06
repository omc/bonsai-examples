import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateMovieDto } from './create-movie.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @ApiProperty({ example: 'The Fifth Element', type: String })
  @IsNotEmpty()
  title: string;
}
