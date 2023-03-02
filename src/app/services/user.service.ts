import { Injectable } from "@angular/core";
import { LoginResult } from "src/app/interfaces/interfaces";
import { DataShareService } from "src/app/services/data-share.service";

@Injectable()
export class UserService {
  logged: boolean = false;
  id: number = null;
  username: string = null;
  token: string = null;

  constructor(private dss: DataShareService) {}

  loadLogin(): void {
    const loginObj: any = this.dss.getGlobal("login");
    if (loginObj === null) {
      this.logout();
    } else {
      this.logged = true;
      this.id = loginObj.id;
      this.username = loginObj.username;
      this.token = loginObj.token;
    }
  }

  saveLogin(): void {
    const loginObj = {
      status: "ok",
      id: this.id,
      username: this.username,
      token: this.token,
    } as LoginResult;
    this.dss.setGlobal("login", loginObj);
  }

  logout(): void {
    this.logged = false;
    this.id = null;
    this.username = null;
    this.token = null;
    this.dss.removeGlobal("login");
  }
}
