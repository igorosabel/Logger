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
		str = str.replace(new RegExp("\n","g"), '<br>');

		str = str.replace(new RegExp("\\[b\\](.+?)\\[\/b\\]", "g"), '<strong>$1</strong>');
		str = str.replace(new RegExp("\\[i\\](.+?)\\[\/i\\]", "g"), '<em>$1</em>');
		str = str.replace(new RegExp("\\[u\\](.+?)\\[\/u\\]", "g"), '<u>$1</u>');
		
		str = str.replace(new RegExp("\\[l\\](.+?)\\[\/l\\]", "g"), '<div class="align-left">$1</div>');
		str = str.replace(new RegExp("\\[c\\](.+?)\\[\/c\\]", "g"), '<div class="align-center">$1</div>');
		str = str.replace(new RegExp("\\[r\\](.+?)\\[\/r\\]", "g"), '<div class="align-right">$1</div>');
		
		str = str.replace(new RegExp("\\[img\\](.+?)\\[\/img\\]", "g"), '<img src="https://apilogger.osumi.es/getImage/$1');
		
		return str;
	}
	
	get clean() {
		if (this.body===null){
			return '';
		}
		let str = this.body;
		str = str.replace(new RegExp("\n","g"), ' ');
		
		str = str.replace(new RegExp("\\[b\\](.+?)\\[\/b\\]", "g"), '$1');
		str = str.replace(new RegExp("\\[i\\](.+?)\\[\/i\\]", "g"), '$1');
		str = str.replace(new RegExp("\\[u\\](.+?)\\[\/u\\]", "g"), '$1');
		
		str = str.replace(new RegExp("\\[l\\](.+?)\\[\/l\\]", "g"), '$1');
		str = str.replace(new RegExp("\\[c\\](.+?)\\[\/c\\]", "g"), '$1');
		str = str.replace(new RegExp("\\[r\\](.+?)\\[\/r\\]", "g"), '$1');
		
		str = str.replace(new RegExp("\\[img\\](.+?)\\[\/img\\]", "g"), '');
		
		return str;
	}
}