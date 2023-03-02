import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { LoginResult, RegisterData } from "src/app/interfaces/interfaces";
import { MaterialModule } from "src/app/modules/material/material.module";
import { ApiService } from "src/app/services/api.service";
import { CommonService } from "src/app/services/common.service";
import { UserService } from "src/app/services/user.service";

@Component({
  standalone: true,
  selector: "gst-register",
  templateUrl: "./register.component.html",
  imports: [CommonModule, MaterialModule, FormsModule, RouterModule],
})
export default class RegisterComponent implements OnInit {
  registerData = {
    username: "",
    pass: "",
    conf: "",
  } as RegisterData;
  registerUsernameError: boolean = false;
  registerPassError: boolean = false;
  registerSending: boolean = false;

  constructor(
    private as: ApiService,
    private user: UserService,
    private cs: CommonService,
    private router: Router
  ) {}

  ngOnInit(): void {}

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
          this.user.logged = true;
          this.user.id = result.id;
          this.user.username = this.cs.urldecode(result.username);
          this.user.token = this.cs.urldecode(result.token);
          this.user.saveLogin();

          this.router.navigate(["/main"]);
        } else {
          this.registerUsernameError = true;
        }
      });
  }
}
