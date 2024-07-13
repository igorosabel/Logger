import { Injectable } from '@angular/core';
import { LoginResult } from '@interfaces/interfaces';
import User from '@model/user.model';

@Injectable()
export default class UserService {
  logged: boolean = false;
  user: User | null = null;

  loadLogin(): void {
    const loginStr: string | null = localStorage.getItem('login');
    if (loginStr !== null) {
      const loginObj: LoginResult = JSON.parse(loginStr);
      if (loginObj === null) {
        this.logout();
      } else {
        this.logged = true;
        this.user = new User().fromInterface(loginObj.user);
      }
    }
  }

  saveLogin(): void {
    if (this.user !== null) {
      const loginObj: LoginResult = {
        status: 'ok',
        user: this.user.toInterface(),
      };
      localStorage.setItem('login', JSON.stringify(loginObj));
    }
  }

  logout(): void {
    this.logged = false;
    this.user = null;
    localStorage.removeItem('login');
  }
}
