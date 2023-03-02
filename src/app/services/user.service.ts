import { Injectable } from "@angular/core";
import { LoginResult } from "src/app/interfaces/interfaces";
import { User } from "src/app/model/user.model";
import { DataShareService } from "src/app/services/data-share.service";

@Injectable()
export class UserService {
  logged: boolean = false;
  user: User = null;

  constructor(private dss: DataShareService) {}

  loadLogin(): void {
    const loginObj: LoginResult = this.dss.getGlobal("login");
    if (loginObj === null) {
      this.logout();
    } else {
      this.logged = true;
      this.user = new User().fromInterface({
        id: loginObj.user.id,
        username: loginObj.user.username,
        token: loginObj.user.token,
      });
    }
  }

  saveLogin(): void {
    const loginObj: LoginResult = {
      status: "ok",
      user: this.user.toInterface(),
    };
    this.dss.setGlobal("login", loginObj);
  }

  logout(): void {
    this.logged = false;
    this.user = null;
    this.dss.removeGlobal("login");
  }
}
