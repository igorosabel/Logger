import { environment } from '../../environments/environment';
export class Photo {
	constructor(
		public id: number = null,
		public createdAt: string = null,
		public updatedAt: string = null
	){ }
	
	get url() {
		return environment.apiUrl+'getEntryPhoto/' + this.id;
	}
}