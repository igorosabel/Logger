import { environment } from "@env/environment";
import { PhotoInterface } from "@interfaces/interfaces";

export class Photo {
  constructor(
    public id: number = null,
    public createdAt: string = null,
    public updatedAt: string = null
  ) {}

  get url(): string {
    return environment.apiUrl + "getEntryPhoto/" + this.id;
  }

  fromInterface(p: PhotoInterface): Photo {
    this.id = p.id;
    this.createdAt = p.createdAt;
    this.updatedAt = p.updatedAt;

    return this;
  }

  toInterface(): PhotoInterface {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
