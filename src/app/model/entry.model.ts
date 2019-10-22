import { Tag } from './tag.model';

export class Entry {
	tags: Tag[];
	
	constructor(public id: number, public title: string, public slug: string, public body: string, public createdAt: string, public updatedAt: string){
		this.tags = [];
	}
	
	addTag(tag: Tag){
		this.tags.push(tag);
	}
}