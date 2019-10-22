import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ApiService }        from '../../services/api.service';
import { Entry }             from '../../model/entry.model';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
	username: string;
	entry: Entry;
	
	constructor(private activatedRoute: ActivatedRoute, private as: ApiService) {
		this.entry = new Entry(null, 'Nueva entrada');
	}
	ngOnInit() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.username = params.username;
		});
	}
}