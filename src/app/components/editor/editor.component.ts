import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ApiService }         from '../../services/api.service';
import { ClassMapperService } from '../../services/class-mapper.service';
import { DialogService }      from '../../services/dialog.service';
import { Entry }              from '../../model/entry.model';
import { Tag }                from '../../model/tag.model';
import { Photo }              from '../../model/photo.model';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
	entry : Entry;
	@ViewChild('title', { static: true }) titleBox: ElementRef;
	@ViewChild('entryText', { static: true }) entryText: ElementRef;
	tagList: Tag[];
	tags: string = '';
	canPhotos: boolean = false;
	photoList: Photo[];
	showPhotos: boolean = false;
	selectedPhoto: number = null;
	@ViewChild('photoUpload', { static: true }) photoUpload: ElementRef;
	loading: boolean = true;
	@Output() onLoading = new EventEmitter<boolean>();

	constructor(private as: ApiService, private cms: ClassMapperService, private dialog: DialogService) {
		this.entry = new Entry();
		this.tagList = [];
	}

	loadEntry(entry: Entry) {
		this.entry = entry;
		this.tags = this.entry.tags.map(x => x.name).join(', ');
		this.loadTags();
	}
	
	loadTags() {
		this.as.getTags().subscribe(response => {
			if (response.status=='ok') {
				this.tagList = this.cms.getTags(response);
				if (this.entry.id){
					this.canPhotos = true;
					this.loadPhotos();
				}
				else{
					this.onLoading.emit(false);
				}
			}
		});
	}
	
	loadPhotos() {
		this.as.getPhotos(this.entry.id).subscribe(response => {
			this.photoList = this.cms.getPhotos(response);
			this.onLoading.emit(false);
		});
	}
	
	getEntry() {
		this.entry.loadTags(this.tags);
		return this.entry;
	}
	
	focusTitle() {
		this.titleBox.nativeElement.focus();
	}
	
	getSel() {
	    // obtain the object reference for the <textarea>
	    const txtarea = this.entryText.nativeElement;
	    // obtain the index of the first selected character
	    const start = txtarea.selectionStart;
	    // obtain the index of the last selected character
	    const finish = txtarea.selectionEnd;
	    // obtain the selected text
	    const sel = txtarea.value.substring(start, finish);
	    // do something with the selected content
	    
	    return {txtarea, start, finish, sel};
	}
	
	applyFormat(format: string) {
		const selectionObj = this.getSel();
		if (selectionObj.sel != '') {
			this.entry.body = this.entry.body.substring(0, selectionObj.start) + '['+format+']' + selectionObj.sel + '[/'+format+']' + this.entry.body.substring(selectionObj.finish, this.entry.body.length);
		}
	}
	
	addTag(tag: Tag) {
		let selectedTags = [];
		if (this.tags!='') {
			selectedTags = this.tags.split(',').map(x => x.trim());
		}

		const tagIndex = selectedTags.findIndex(x => x==tag.name);
		if (tagIndex!=-1) {
			return false;
		}
		
		selectedTags.push(tag.name);
		this.tags = selectedTags.join(', ');
	}
	
	openPhotos() {
		this.selectedPhoto = null;
		this.showPhotos = true;
	}
	
	closePhotos() {
		this.showPhotos = false;
	}
	
	selectPhoto(photo: Photo) {
		this.selectedPhoto = photo.id;
	}
	
	insertPhoto() {
		this.entry.body += "\n[img]" + this.selectedPhoto + "[/img]\n";
		this.closePhotos();
	}
	
	addPhoto() {
		this.photoUpload.nativeElement.click();
	}
	
	photoContinue(ev) {
		const file = ev.target.files[0];
		const validList = ['jpg', 'jpeg', 'png'];
		const fileExt = file.name.split('.').pop();
		if (validList.indexOf(fileExt)==-1){
			this.dialog.alert({title: 'Error', content: 'Solo está permitido imágenes de los siguientes tipos: '+validList.join(', '), ok: 'Continuar'}).subscribe(result => {});
		}
		else{
			const fr = new FileReader();
	        fr.onload = () => {
	            const base64 = fr.result.toString();
	            this.as.uploadPhoto(this.entry.id, base64).subscribe(result => {
		            const photo = this.cms.getPhoto(result.photo);
		            this.photoList.push( photo );
		            this.selectedPhoto = photo.id;
	            });
	        }
	        fr.readAsDataURL(file);
		}
	}
}