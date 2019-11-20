import { Injectable } from '@angular/core';
import { Entry }      from '../model/entry.model';
import { Tag }        from '../model/tag.model';
import { Photo }      from '../model/photo.model';
import { EntriesResult, EntryInterface, TagsResult, TagInterface, PhotosResult, PhotoInterface } from '../interfaces/interfaces';

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
	
	getTags(response: TagsResult) {
		const tags: Tag[] = [];

		for (let t of response.list) {
			let tag = this.getTag(t);
			tags.push(tag);
		}
		
		return tags;
	}
	
	getTag(t: TagInterface) {
		let tag = new Tag(t.id, t.name, t.slug, t.createdAt, t.updatedAt);
		
		return tag;
	}
	
	getPhotos(response: PhotosResult) {
		const photos: Photo[] = [];

		for (let p of response.list) {
			let photo = this.getPhoto(p);
			photos.push(photo);
		}
		
		return photos;
	}
	
	getPhoto(p: PhotoInterface) {
		return new Photo(p.id, p.createdAt, p.updatedAt);
	}
}