import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { LoginData, LoginResult } from "src/app/interfaces/interfaces";
import { MaterialModule } from "src/app/modules/material/material.module";
import { ApiService } from "src/app/services/api.service";
import { AuthService } from "src/app/services/auth.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { CryptoService } from "src/app/services/crypto.service";
import { UserService } from "src/app/services/user.service";

@Component({
  standalone: true,
  selector: "app-login",
  templateUrl: "./login.component.html",
  imports: [CommonModule, MaterialModule, FormsModule, RouterModule],
})
export class LoginComponent implements OnInit {
  loginData: LoginData = {
    username: "",
    pass: "",
  };
  loginError: boolean = false;
  loginSending: boolean = false;

  constructor(
    private as: ApiService,
    private us: UserService,
    private cms: ClassMapperService,
    private router: Router,
    private auth: AuthService,
    private crypto: CryptoService
  ) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(["/" + this.us.user.username]);
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
        this.us.logged = true;
        this.us.user = this.cms.getUser(result.user);
        this.us.user.secret = this.crypto.hash(
          this.us.user.id + "-" + this.loginData.pass
        );
        this.us.saveLogin();

        this.router.navigate(["/" + this.us.user.username]);
      } else {
        this.loginError = true;
      }
    });
  }
}
