import { Component, OnInit }  from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ApiService }         from '../../services/api.service';
import { ClassMapperService } from '../../services/class-mapper.service';
import { UserService }        from '../../services/user.service';
import { Entry }              from '../../model/entry.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
	username: string;
	entryList: Entry[];

	constructor(private activatedRoute: ActivatedRoute, private router: Router, private user: UserService, private as: ApiService, private cms: ClassMapperService) {
		this.entryList = [];
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.username = params.username;
			this.loadEntries();
		});
	}
	
	loadEntries() {
		this.as.getEntries().subscribe(response => {
			if (response.status=='ok') {
				this.entryList = this.cms.getEntries(response);
			}
		});
	}
	
	logout(ev) {
		ev.preventDefault();
		this.user.logout();
		this.router.navigate(['/']);
	}
}