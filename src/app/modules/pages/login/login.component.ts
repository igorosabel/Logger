import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { LoginData, LoginResult } from '@interfaces/interfaces';
import ApiService from '@services/api.service';
import AuthService from '@services/auth.service';
import ClassMapperService from '@services/class-mapper.service';
import CryptoService from '@services/crypto.service';
import DataShareService from '@services/data-share.service';
import UserService from '@services/user.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
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
export default class LoginComponent implements OnInit {
  private as: ApiService = inject(ApiService);
  private us: UserService = inject(UserService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private router: Router = inject(Router);
  private auth: AuthService = inject(AuthService);
  private crypto: CryptoService = inject(CryptoService);

  loginData: LoginData = {
    username: '',
    pass: '',
  };
  loginError: WritableSignal<boolean> = signal<boolean>(false);
  loginSending: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  doLogin(ev: MouseEvent): void {
    ev.preventDefault();

    if (this.loginData.username === '' || this.loginData.pass === '') {
      return;
    }

    this.loginSending.set(true);
    this.as.login(this.loginData).subscribe((result: LoginResult): void => {
      this.loginSending.set(false);
      if (result.status === 'ok') {
        this.us.logged = true;
        this.us.user = this.cms.getUser(result.user);
        this.crypto
          .hash(this.us.user.id + '-' + this.loginData.pass)
          .then((ret: string): void => {
            if (this.us.user !== null) {
              this.us.user.secret = ret;
            }
            this.us.saveLogin();
            this.router.navigate(['/home']);
          });
      } else {
        this.loginError.set(true);
      }
    });
  }
}
