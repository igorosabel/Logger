import { Injectable }  from '@angular/core';
import { Entry }       from '../model/entry.model';
import { Tag }         from '../model/tag.model';
import { EntriesResult, EntryInterface } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ClassMapperService {
	constructor() { }

	getEntries(response: EntriesResult) {
		const entries: Entry[] = [];

		for (let e of response.list) {
			let entry = this.getEntry(e);
			entries.push(entry);
		}
		
		return entries;
	}
	
	getEntry(e: EntryInterface) {
		let entry = new Entry(e.id, e.title, e.slug, e.body, e.createdAt, e.updatedAt);
		for (let t of e.tags) {
			let tag = new Tag(t.id, t.name, t.slug, t.createdAt, t.updatedAt);
			entry.addTag(tag);
		}
		
		return entry;
	}
}