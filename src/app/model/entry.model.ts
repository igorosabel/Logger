import { Injectable } from '@angular/core';

export class Entry {
	constructor(public id: number, public title: string, public slug: string, public body: string, public createdAt: string, public updatedAt: string){ }
}

@Injectable({
    providedIn: 'root'
})
export class EntryAdapter {
  adapt(item: any): Entry {
    return new Entry(
      item.id,
      item.title,
      item.slug,
      item.body,
	  item.createdAt,
	  item.updatedAt
    );
  }
}