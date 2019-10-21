import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { RegisterData }      from '../../interfaces/interfaces';
import { ApiService }        from '../../services/api.service';
import { UserService }       from '../../services/user.service';
import { CommonService }     from '../../services/common.service';

@Component({
  selector: 'gst-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerData = {
		username: '',
		pass: '',
		conf: ''
	} as RegisterData;
	registerUsernameError: boolean = false;
	registerPassError: boolean = false;
	registerSending: boolean = false;

	constructor(private as: ApiService, private user: UserService, private cs: CommonService, private router: Router) {}
	ngOnInit() {}
	
	doRegister(ev) {
		ev.preventDefault();
		
		if (this.registerData.username==='' || this.registerData.pass==='' || this.registerData.conf===''){
			return false;
		}
		
		this.registerUsernameError = false;
		this.registerPassError = false;
		if (this.registerData.pass !== this.registerData.conf){
			this.registerPassError = true;
			return false;
		}
		
		this.registerSending = true;
		this.as.register(this.registerData).subscribe(result => {
			this.registerSending = false;
			if (result.status==='ok'){
				this.user.logged   = true;
				this.user.id       = result.id;
				this.user.username = this.cs.urldecode(result.username);
				this.user.token    = this.cs.urldecode(result.token);
				this.user.saveLogin();
				
				this.router.navigate(['/main']);
			}
			else{
				this.registerUsernameError = true;
			}
		});
	}
}