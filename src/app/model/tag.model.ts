import { TagInterface } from "src/app/interfaces/interfaces";
import { Utils } from "src/app/modules/shared/utils.class";

export class Tag {
  constructor(
    public id: number = null,
    public name: string = null,
    public createdAt: string = null,
    public updatedAt: string = null,
    public isPublic: boolean = false
  ) {}

  fromInterface(t: TagInterface): Tag {
    this.id = t.id;
    this.name = Utils.urldecode(t.name);
    this.createdAt = t.createdAt;
    this.updatedAt = t.updatedAt;
    this.isPublic = t.isPublic;

    return this;
  }

  toInterface(): TagInterface {
    return {
      id: this.id,
      name: Utils.urlencode(this.name),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isPublic: this.isPublic,
    };
  }
}
