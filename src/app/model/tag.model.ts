import { TagInterface } from '@interfaces/interfaces';
import Utils from '@shared/utils.class';

export default class Tag {
  constructor(
    public id: number | null = null,
    public name: string | null = null,
    public num: number = 0,
    public createdAt: string | null = null,
    public updatedAt: string | null = null,
    public isPublic: boolean = false
  ) {}

  fromInterface(t: TagInterface): Tag {
    this.id = t.id;
    this.name = Utils.urldecode(t.name);
    this.num = t.num;
    this.createdAt = t.createdAt;
    this.updatedAt = t.updatedAt;
    this.isPublic = t.isPublic;

    return this;
  }

  toInterface(): TagInterface {
    return {
      id: this.id,
      name: Utils.urlencode(this.name),
      num: this.num,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isPublic: this.isPublic,
    };
  }
}
