import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

// We use class-transformer in ORM entity and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an ORM entity directly in response.
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'movie',
})
export class MovieEntity extends EntityRelationalHelper {
  @ApiProperty({
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: String,
    example: 'The Fifth Element',
  })
  @Column({ type: String, unique: true, nullable: false })
  title: string;

  @ApiProperty({
    type: String,
    example: '...\nUTAPAN: Chief says...\n...',
  })
  @Column({ type: String, nullable: true })
  script: string;

  script_embedding_vector: number[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date | undefined;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date | undefined;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date | undefined;
}
