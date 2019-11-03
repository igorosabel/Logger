import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ApiService }         from '../../services/api.service';
import { ClassMapperService } from '../../services/class-mapper.service';
import { Entry }              from '../../model/entry.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
	username: string;
	entry: Entry;

	constructor(private activatedRoute: ActivatedRoute, private as: ApiService, private cms: ClassMapperService) {
		this.entry = new Entry();
	}
	ngOnInit() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.username = params.username;
			this.loadEntry(params.id);
		});
	}
	
	loadEntry(id: number) {
		this.as.getEntry(id).subscribe(response => {
			if (response.status=='ok') {
				this.entry = this.cms.getEntry(response.entry);
			}
		});
	}
}