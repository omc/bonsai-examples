import { ApiProperty } from '@nestjs/swagger';

const idType = Number;

export class Movie {
  @ApiProperty({
    type: idType,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'The Fifth Element',
  })
  title: string;

  @ApiProperty()
  createdAt: Date | undefined;

  @ApiProperty()
  updatedAt: Date | undefined;

  @ApiProperty()
  deletedAt: Date | undefined;
}
