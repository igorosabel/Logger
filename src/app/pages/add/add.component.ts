import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ApiService }         from '../../services/api.service';
import { ClassMapperService } from '../../services/class-mapper.service';
import { DialogService }      from '../../services/dialog.service';
import { Entry }              from '../../model/entry.model';
import { EditorComponent }    from '../../components/editor/editor.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
	loading: boolean = true;
	username: string;
	entry: Entry;
	@ViewChild('editor', { static: true }) editor: EditorComponent;
	
	constructor(private activatedRoute: ActivatedRoute, private as: ApiService, private cms: ClassMapperService, private dialog: DialogService, private router: Router) {
		this.entry = new Entry(null, 'Nueva entrada');
	}
	
	ngOnInit() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.username = params.username;
			this.editor.loadEntry(this.entry);
		});
	}
	
	editorLoaded(ev) {
		this.loading = ev;
	}
	
	saveEntry() {
		this.entry = this.editor.getEntry();
		
		if (this.entry.title=='') {
			this.dialog.alert({title: 'Error', content: '¡No puedes dejar el título de la entrada en blanco!', ok: 'Continuar'}).subscribe(result => {
				this.editor.focusTitle();
			});
			return false;
		}
		
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