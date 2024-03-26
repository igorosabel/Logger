import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { UserService } from "@services/user.service";
import { Observable, of } from "rxjs";

@Injectable()
export class AuthService {
  constructor(private us: UserService) {}

  public isAuthenticated(): Observable<boolean> {
    this.us.loadLogin();
    if (!this.us.logged) {
      this.us.logout();
    }
    const helper = new JwtHelperService();
    return of(this.us.logged && !helper.isTokenExpired(this.us.user.token));
  }
}
