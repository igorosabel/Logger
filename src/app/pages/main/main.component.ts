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
	loading: boolean = true;
	username: string;
	entryList: Entry[];
	menuShow: boolean = false;

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
				this.loading = false;
			}
		});
	}
	
	menuOpened(mode) {
		this.menuShow = mode;
	}
	
	logout(ev) {
		ev.preventDefault();
		this.user.logout();
		this.router.navigate(['/']);
	}
}