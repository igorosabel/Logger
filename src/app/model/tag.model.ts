import { TagInterface } from "src/app/interfaces/interfaces";
import { Utils } from "src/app/modules/shared/utils.class";

export class Tag {
  constructor(
    public id: number = null,
    public name: string = null,
    public slug: string = null,
    public createdAt: string = null,
    public updatedAt: string = null
  ) {}

  fromInterface(t: TagInterface): Tag {
    this.id = t.id;
    this.name = Utils.urldecode(t.name);
    this.slug = t.slug;
    this.createdAt = t.createdAt;
    this.updatedAt = t.updatedAt;

    return this;
  }

  toInterface(): TagInterface {
    return {
      id: this.id,
      name: Utils.urlencode(this.name),
      slug: this.slug,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
