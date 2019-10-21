import { Component, OnInit } from '@angular/core';
import { ApiService }        from '../../services/api.service';
import { Entry }             from '../../model/entry.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
	entryList: Entry[];

	constructor(private as: ApiService) {
		this.entryList = [];
	}

	ngOnInit() {
		this.as.getEntries().subscribe((entries: Entry[]) => {
			this.entryList = entries;
			console.log(this.entryList);
		});
	}
}