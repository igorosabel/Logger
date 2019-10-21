import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { LoginData }         from '../../interfaces/interfaces';
import { ApiService }        from '../../services/api.service';
import { UserService }       from '../../services/user.service';
import { CommonService }     from '../../services/common.service';
import { DataShareService }  from '../../services/data-share.service';
import { AuthService }       from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {
  loginData = {
		username: '',
		pass: ''
	} as LoginData;
	loginError: boolean = false;
	loginSending: boolean = false;

	constructor(private as: ApiService,
				private user: UserService,
				private cs: CommonService,
				private router: Router,
				private dss: DataShareService,
				private auth: AuthService) {}
	ngOnInit() {
		if (this.auth.isAuthenticated()){
			this.router.navigate(['/main']);
		}
	}

	doLogin(ev) {
		ev.preventDefault();

		if (this.loginData.username==='' || this.loginData.pass===''){
			return false;
		}

		this.loginSending = true;
		this.as.login(this.loginData).subscribe(result => {
			this.loginSending = false;
			if (result.status==='ok'){
				this.user.logged   = true;
				this.user.id       = result.id;
				this.user.username = this.cs.urldecode(result.username);
				this.user.token    = this.cs.urldecode(result.token);
				this.user.saveLogin();

				this.router.navigate(['/main']);
			}
			else{
				this.loginError = true;
			}
		});
	}
}