import { Injectable }  from '@angular/core';
import { Entry }       from '../model/entry.model';
import { Tag }         from '../model/tag.model';
import { EntryResult } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ClassMapperService {
	constructor() { }

	getEntries(response: EntryResult) {
		const entries: Entry[] = [];

		for (let e of response.list) {
			let entry = new Entry(e.id, e.title, e.slug, e.body, e.createdAt, e.updatedAt);
			for (let t of e.tags) {
				let tag = new Tag(t.id, t.name, t.slug, t.createdAt, t.updatedAt);
				entry.addTag(tag);
			}
			entries.push(entry);
		}
		
		return entries;
	}
}