import { Tag } from './tag.model';

export class Entry {
	tags: Tag[];
	
	constructor(
		public id: number = null,
		public title: string = null,
		public slug: string = null,
		public body: string = null,
		public createdAt: string = null,
		public updatedAt: string = null
	){
		this.tags = [];
	}
	
	addTag(tag: Tag){
		this.tags.push(tag);
	}
	
	get composed() {
		if (this.body===null){
			return '';
		}
		let str = this.body;
		str = str.replace(new RegExp("\n","g"), "<br>");
		return str;
	}
}