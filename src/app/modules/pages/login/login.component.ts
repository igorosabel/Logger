import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { LoginData, LoginResult } from "src/app/interfaces/interfaces";
import { ApiService } from "src/app/services/api.service";
import { AuthService } from "src/app/services/auth.service";
import { ClassMapperService } from "src/app/services/class-mapper.service";
import { CryptoService } from "src/app/services/crypto.service";
import { DataShareService } from "src/app/services/data-share.service";
import { UserService } from "src/app/services/user.service";

@Component({
  standalone: true,
  selector: "app-login",
  templateUrl: "./login.component.html",
  imports: [
    FormsModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [UserService, DataShareService, AuthService, CryptoService],
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
      this.router.navigate(["/home"]);
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
        this.crypto
          .hash(this.us.user.id + "-" + this.loginData.pass)
          .then((ret: string): void => {
            this.us.user.secret = ret;
            console.log(this.us);
            this.us.saveLogin();
            this.router.navigate(["/home"]);
          });
      } else {
        this.loginError = true;
      }
    });
  }
}
