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
	) {
		this.tags = [];
	}
	
	addTag(tag: Tag) {
		this.tags.push(tag);
	}
	
	loadTags(tags: string) {
		if (tags==''){
			this.tags = [];
			return;
		}
		const tagList = tags.split(',').map(x => x.trim());
		for (let t of tagList){
			let ind = this.tags.findIndex(x => x.name==t);
			if (ind==-1){
				let tag = new Tag(null, t);
				this.addTag(tag);
			}
		}
		const newTagList = [];
		for (let t of this.tags){
			let ind = tagList.findIndex(x => x===t.name);
			if (ind!=-1){
				newTagList.push(t);
			}
		}
		this.tags = newTagList;
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