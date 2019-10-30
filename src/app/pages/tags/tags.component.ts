import { Component, OnInit }  from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ApiService }         from '../../services/api.service';
import { ClassMapperService } from '../../services/class-mapper.service';
import { Tag }                from '../../model/tag.model';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: []
})
export class TagsComponent implements OnInit {
	username: string;
	tagList: Tag[];

	constructor(private activatedRoute: ActivatedRoute, private router: Router, private as: ApiService, private cms: ClassMapperService) {
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
}