import { Exclude, instanceToPlain } from 'class-transformer';
import { AfterLoad, BaseEntity } from 'typeorm';

export class EntityRelationalHelper extends BaseEntity {
  @Exclude()
  __entity?: string;

  @AfterLoad()
  setEntityName() {
    this.__entity = this.constructor.name;
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
