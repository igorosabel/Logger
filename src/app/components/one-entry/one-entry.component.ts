import { Component, Input } from '@angular/core';
import { Entry } from '../../model/entry.model';

@Component({
  selector: 'app-one-entry',
  templateUrl: './one-entry.component.html',
  styleUrls: []
})
export class OneEntryComponent {
	@Input() username : string;
	@Input() entry : Entry;

	constructor() {}
}