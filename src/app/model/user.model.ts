import { UserInterface } from "@interfaces/interfaces";
import { Utils } from "@shared/utils.class";

export class User {
  secret: string = null;

  constructor(
    public id: number = null,
    public username: string = null,
    public token: string = null
  ) {}

  fromInterface(u: UserInterface): User {
    this.id = u.id;
    this.username = Utils.urldecode(u.username);
    this.token = u.token;
    this.secret = u.secret ? u.secret : null;

    return this;
  }

  toInterface(): UserInterface {
    return {
      id: this.id,
      username: Utils.urlencode(this.username),
      token: this.token,
      secret: this.secret,
    };
  }
}
