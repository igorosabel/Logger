import { Injectable }       from '@angular/core';
import { DataShareService } from './data-share.service';
import { LoginResult }      from '../interfaces/interfaces';

@Injectable()
export class UserService {
  logged: boolean  = false;
  id: number       = null;
  username: string = null;
  token: string    = null;

  constructor(private dss: DataShareService) {}
  
  loadLogin() {
    const loginObj = this.dss.getGlobal('login');
    if (loginObj === null){
      this.logout();
    }
    else{
      this.logged   = true;
      this.id       = loginObj.id;
      this.username = loginObj.username;
      this.token    = loginObj.token;
	  }
  }
  
  saveLogin() {
    const loginObj = {
      status: 'ok',
      id: this.id,
      username: this.username,
      token: this.token
    } as LoginResult;
    this.dss.setGlobal('login', loginObj);
  }
  
  logout() {
    this.logged = false;
    this.id = null;
    this.username = null;
    this.token = null;
    this.dss.removeGlobal('login');
  }
}