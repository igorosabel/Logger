import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ApiService }         from '../../services/api.service';
import { ClassMapperService } from '../../services/class-mapper.service';
import { DialogService }      from '../../services/dialog.service';
import { Entry }              from '../../model/entry.model';
import { Tag }                from '../../model/tag.model';
import { Photo }              from '../../model/photo.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
	loading: boolean = true;
	username: string;
	idEntry: number = null;
	entry: Entry;
	@ViewChild('title', { static: true }) titleBox: ElementRef;
	@ViewChild('entryText', { static: true }) entryText: ElementRef;
	tagList: Tag[];
	tags: string = '';
	photoList: Photo[];
	showPhotos: boolean = false;
	selectedPhoto: number = null;
	@ViewChild('photoUpload', { static: true }) photoUpload: ElementRef;

	constructor(private activatedRoute: ActivatedRoute, private as: ApiService, private cms: ClassMapperService, private dialog: DialogService, private router: Router) {
		this.entry = new Entry(null, 'Nueva entrada');
		this.tagList = [];
		this.photoList = [];
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.username = params.username;
			this.idEntry  = params.id;
			this.loadEntry();
		});
	}
	
	loadEntry() {
		this.as.getEntry(this.idEntry).subscribe(response => {
			if (response.status=='ok') {
				this.entry = this.cms.getEntry(response.entry);
				this.tags = this.entry.tags.map(x => x.name).join(', ');
				this.loadTags();
			}
			else {
				this.dialog.alert({title: 'Error', content: 'Ocurrió un error al cargar la entrada. Inténtalo de nuevo más tarde por favor.', ok: 'Continuar'}).subscribe(result => {});
			}
		});
	}
	
	loadTags() {
		this.as.getTags().subscribe(response => {
			if (response.status=='ok') {
				this.tagList = this.cms.getTags(response);
				this.loadPhotos();
			}
		});
	}
	
	loadPhotos() {
		this.as.getPhotos(this.idEntry).subscribe(response => {
			this.photoList = this.cms.getPhotos(response);
			this.loading = false;
		});
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
		this.entry.body += "\n[IMG_" + this.selectedPhoto + "]\n";
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
			if (result.status=='ok') {
				this.loading = false;
				this.dialog.alert({title: 'OK', content: 'La entrada "' + this.entry.title + '" ha sido guardada.', ok: 'Continuar'}).subscribe(result => {
					this.router.navigate(['/'+this.username]);
				});
			}
			else {
				this.dialog.alert({title: 'Error', content: 'Ocurrió un error al guardar la entrada. Inténtalo de nuevo más tarde por favor.', ok: 'Continuar'}).subscribe(result => {});
			}
		});
	}
	
	deleteEntry() {
		this.dialog.confirm({title: 'Confirmar', content: '¿Estás seguro de querer borrar esta entrada? Esta acción es irreversible', ok: 'Continuar', cancel: 'Cancelar'}).subscribe(result => {
			if (result===true){
				this.loading = true;
				this.as.deleteEntry(this.idEntry).subscribe(result => {
					this.loading = false;
					if (result.status==='ok') {
						this.dialog.alert({title: 'Entrada borrada', content: 'La entrada ha sido borrada correctamente.', ok: 'Continuar'}).subscribe(result => {
							this.router.navigate(['/', this.username]);
						})
					}
					else{
						this.dialog.alert({title: 'Error', content: 'Ocurrió un error al borrar la entrada. Inténtalo de nuevo más tarde por favor.', ok: 'Continuar'}).subscribe(result => {});
					}
				});
			}
		});
	}
}