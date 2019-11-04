import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ApiService }         from '../../services/api.service';
import { ClassMapperService } from '../../services/class-mapper.service';
import { DialogService }      from '../../services/dialog.service';
import { Entry }              from '../../model/entry.model';
import { Tag }                from '../../model/tag.model';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
	loading: boolean = true;
	username: string;
	entry: Entry;
	@ViewChild('title', { static: true }) titleBox:ElementRef;
	tagList: Tag[];
	tags: string = '';
	
	constructor(private activatedRoute: ActivatedRoute, private as: ApiService, private cms: ClassMapperService, private dialog: DialogService, private router: Router) {
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
				this.loading = false;
			}
		});
	}
	
	addTag(tag: Tag) {
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
	
	saveEntry() {
		if (this.entry.title=='') {
			this.dialog.alert({title: 'Error', content: '¡No puedes dejar el título de la entrada en blanco!', ok: 'Continuar'}).subscribe(result => {
				this.titleBox.nativeElement.focus();
			});
			return false;
		}
		
		this.entry.loadTags(this.tags);
		this.loading = true;
		
		this.as.saveEntry(this.entry).subscribe(result => {
			this.loading = false;
			if (result.status=='ok') {
				this.dialog.alert({title: 'OK', content: 'La nueva entrada "' + this.entry.title + '" ha sido guardada.', ok: 'Continuar'}).subscribe(result => {
					this.router.navigate(['/'+this.username]);
				});
			}
			else {
				this.dialog.alert({title: 'Error', content: 'Ocurrió un error al guardar la entrada. Inténtalo de nuevo más tarde por favor.', ok: 'Continuar'}).subscribe(result => {});
			}
		});
	}
}