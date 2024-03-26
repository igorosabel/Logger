import { Injectable } from "@angular/core";
import { LoginResult } from "@interfaces/interfaces";
import { User } from "@model/user.model";

@Injectable()
export class UserService {
  logged: boolean = false;
  user: User = null;

  loadLogin(): void {
    const loginObj: LoginResult = JSON.parse(localStorage.getItem("login"));
    if (loginObj === null) {
      this.logout();
    } else {
      this.logged = true;
      this.user = new User().fromInterface(loginObj.user);
    }
  }

  saveLogin(): void {
    const loginObj: LoginResult = {
      status: "ok",
      user: this.user.toInterface(),
    };
    localStorage.setItem("login", JSON.stringify(loginObj));
  }

  logout(): void {
    this.logged = false;
    this.user = null;
    localStorage.removeItem("login");
  }
}
