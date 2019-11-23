export class Photo {
	constructor(
		public id: number = null,
		public createdAt: string = null,
		public updatedAt: string = null
	){ }
	
	get url() {
		return 'https://apilogger.osumi.es/api/getEntryPhoto/' + this.id;
	}
}