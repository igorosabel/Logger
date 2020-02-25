import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ApiService }         from '../../services/api.service';
import { ClassMapperService } from '../../services/class-mapper.service';
import { DialogService }      from '../../services/dialog.service';
import { DataShareService }   from '../../services/data-share.service';
import { Entry }              from '../../model/entry.model';

@Component({
	selector: 'app-public-detail',
	templateUrl: './public-detail.component.html',
	styleUrls: ['./public-detail.component.scss']
})
export class PublicDetailComponent implements OnInit {
	loading: boolean = true;
	username: string;
	entry: Entry;

	constructor(private activatedRoute: ActivatedRoute, private router: Router, private dss: DataShareService, private as: ApiService, private cms: ClassMapperService, private dialog: DialogService) {
		this.entry = new Entry();
	}
	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.username = params.username;
			this.loadEntry(params.id);
		});
	}
	
	loadEntry(id: number) {
		this.as.getPublicEntry(id).subscribe(response => {
			if (response.status=='ok') {
				this.entry = this.cms.getEntry(response.entry);
				this.loading = false;
			}
			else{
				this.dialog.alert({title: 'Error', content: 'Ocurrió un error al cargar la entrada', ok: 'Continuar'}).subscribe(result => {
					this.router.navigate(['/']);
				});
			}
		});
	}
}