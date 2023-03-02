import { Injectable } from "@angular/core";
import {
  EntriesResult,
  EntryInterface,
  PhotoInterface,
  PhotosResult,
  TagInterface,
  TagsResult,
} from "src/app/interfaces/interfaces";
import { Entry } from "src/app/model/entry.model";
import { Photo } from "src/app/model/photo.model";
import { Tag } from "src/app/model/tag.model";

@Injectable({
  providedIn: "root",
})
export class ClassMapperService {
  constructor() {}

  getEntries(response: EntriesResult): Entry[] {
    const entries: Entry[] = [];

    for (let e of response.list) {
      let entry = this.getEntry(e);
      entries.push(entry);
    }

    return entries;
  }

  getEntry(e: EntryInterface): Entry {
    let entry = new Entry(
      e.id,
      e.title,
      e.slug,
      e.body,
      e.isPublic,
      e.createdAt,
      e.updatedAt
    );
    for (let t of e.tags) {
      let tag = new Tag(t.id, t.name, t.slug, t.createdAt, t.updatedAt);
      entry.addTag(tag);
    }

    return entry;
  }

  getTags(response: TagsResult): Tag[] {
    const tags: Tag[] = [];

    for (let t of response.list) {
      let tag = this.getTag(t);
      tags.push(tag);
    }

    return tags;
  }

  getTag(t: TagInterface): Tag {
    let tag = new Tag(t.id, t.name, t.slug, t.createdAt, t.updatedAt);

    return tag;
  }

  getPhotos(response: PhotosResult): Photo[] {
    const photos: Photo[] = [];

    for (let p of response.list) {
      let photo = this.getPhoto(p);
      photos.push(photo);
    }

    return photos;
  }

  getPhoto(p: PhotoInterface): Photo {
    return new Photo(p.id, p.createdAt, p.updatedAt);
  }
}
