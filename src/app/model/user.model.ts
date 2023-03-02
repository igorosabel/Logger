import { UserInterface } from "src/app/interfaces/interfaces";
import { Utils } from "src/app/modules/shared/utils.class";

export class User {
  constructor(
    public id: number = null,
    public username: string = null,
    public token: string = null
  ) {}

  fromInterface(u: UserInterface): User {
    this.id = u.id;
    this.username = Utils.urldecode(u.username);
    this.token = u.token;

    return this;
  }

  toInterface(): UserInterface {
    return {
      id: this.id,
      username: Utils.urlencode(this.username),
      token: this.token,
    };
  }
}
