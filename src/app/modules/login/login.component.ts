import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { LoginData, LoginResult } from "src/app/interfaces/interfaces";
import { MaterialModule } from "src/app/modules/material/material.module";
import { ApiService } from "src/app/services/api.service";
import { AuthService } from "src/app/services/auth.service";
import { CommonService } from "src/app/services/common.service";
import { DataShareService } from "src/app/services/data-share.service";
import { UserService } from "src/app/services/user.service";

@Component({
  standalone: true,
  selector: "app-login",
  templateUrl: "./login.component.html",
  imports: [CommonModule, MaterialModule, FormsModule, RouterModule],
})
export class LoginComponent implements OnInit {
  loginData = {
    username: "",
    pass: "",
  } as LoginData;
  loginError: boolean = false;
  loginSending: boolean = false;

  constructor(
    private as: ApiService,
    private user: UserService,
    private cs: CommonService,
    private router: Router,
    private dss: DataShareService,
    private auth: AuthService
  ) {}
  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      console.log("isAuthenticated");
      console.log("/" + this.user.username);
      this.router.navigate(["/" + this.user.username]);
    }
  }

  doLogin(ev: MouseEvent): void {
    ev.preventDefault();

    if (this.loginData.username === "" || this.loginData.pass === "") {
      return;
    }

    this.loginSending = true;
    this.as.login(this.loginData).subscribe((result: LoginResult): void => {
      this.loginSending = false;
      if (result.status === "ok") {
        this.user.logged = true;
        this.user.id = result.id;
        this.user.username = this.cs.urldecode(result.username);
        this.user.token = this.cs.urldecode(result.token);
        this.user.saveLogin();

        this.router.navigate(["/" + this.user.username]);
      } else {
        this.loginError = true;
      }
    });
  }
}
