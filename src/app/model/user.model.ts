import { UserInterface } from '@interfaces/interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class User {
  secret: string | null = null;

  constructor(
    public id: number | null = null,
    public username: string | null = null,
    public token: string | null = null
  ) {}

  fromInterface(u: UserInterface): User {
    this.id = u.id;
    this.username = urldecode(u.username);
    this.token = u.token;
    this.secret = u.secret ? u.secret : null;

    return this;
  }

  toInterface(): UserInterface {
    return {
      id: this.id,
      username: urlencode(this.username),
      token: this.token,
      secret: this.secret,
    };
  }
}
