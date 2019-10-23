import { Component, OnInit }  from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ApiService }         from '../../services/api.service';
import { ClassMapperService } from '../../services/class-mapper.service';
import { Entry }              from '../../model/entry.model';
import { Tag }                from '../../model/tag.model';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
	username: string;
	entry: Entry;
	tagList: Tag[];
	tags: string = '';
	
	constructor(private activatedRoute: ActivatedRoute, private as: ApiService, private cms: ClassMapperService) {
		this.entry = new Entry(null, 'Nueva entrada');
		this.tagList = [];
	}
	
	ngOnInit() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.username = params.username;
			this.loadTags();
		});
	}
	
	loadTags() {
		this.as.getTags().subscribe(response => {
			if (response.status=='ok') {
				this.tagList = this.cms.getTags(response);
			}
		});
	}
	
	addTag(tag: Tag) {
		debugger;
		let selectedTags = [];
		if (this.tags!=''){
			selectedTags = this.tags.split(',').map(x => x.trim());
		}

		const tagIndex = selectedTags.findIndex(x => x==tag.name);
		if (tagIndex!=-1){
			return false;
		}
		
		selectedTags.push(tag.name);
		this.tags = selectedTags.join(', ');
	}
}