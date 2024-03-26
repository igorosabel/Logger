import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { LoginResult, RegisterData } from "@interfaces/interfaces";
import { ApiService } from "@services/api.service";
import { ClassMapperService } from "@services/class-mapper.service";
import { CryptoService } from "@services/crypto.service";
import { DataShareService } from "@services/data-share.service";
import { UserService } from "@services/user.service";

@Component({
  standalone: true,
  selector: "app-register",
  templateUrl: "./register.component.html",
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
  providers: [UserService, DataShareService, CryptoService],
})
export default class RegisterComponent {
  registerData: RegisterData = {
    username: "",
    pass: "",
    conf: "",
  };
  registerUsernameError: boolean = false;
  registerPassError: boolean = false;
  registerSending: boolean = false;

  constructor(
    private as: ApiService,
    private us: UserService,
    private cms: ClassMapperService,
    private router: Router,
    private crypto: CryptoService
  ) {}

  doRegister(ev: MouseEvent): void {
    ev.preventDefault();

    if (
      this.registerData.username === "" ||
      this.registerData.pass === "" ||
      this.registerData.conf === ""
    ) {
      return;
    }

    this.registerUsernameError = false;
    this.registerPassError = false;
    if (this.registerData.pass !== this.registerData.conf) {
      this.registerPassError = true;
      return;
    }

    this.registerSending = true;
    this.as
      .register(this.registerData)
      .subscribe((result: LoginResult): void => {
        this.registerSending = false;
        if (result.status === "ok") {
          this.us.logged = true;
          this.us.logged = true;
          this.us.user = this.cms.getUser(result.user);
          this.crypto
            .hash(this.us.user.id + "-" + this.registerData.pass)
            .then((ret: string): void => {
              this.us.user.secret = ret;
              this.us.saveLogin();
              this.router.navigate(["/home"]);
            });
        } else {
          this.registerUsernameError = true;
        }
      });
  }
}
