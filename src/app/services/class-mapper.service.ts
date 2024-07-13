import { Injectable } from '@angular/core';
import {
  EntryInterface,
  PhotoInterface,
  TagInterface,
  UserInterface,
} from '@interfaces/interfaces';
import Entry from '@model/entry.model';
import Photo from '@model/photo.model';
import Tag from '@model/tag.model';
import User from '@model/user.model';

@Injectable({
  providedIn: 'root',
})
export default class ClassMapperService {
  getEntries(es: EntryInterface[]): Entry[] {
    return es.map((e: EntryInterface): Entry => {
      return this.getEntry(e);
    });
  }

  getEntry(e: EntryInterface): Entry {
    return new Entry().fromInterface(e);
  }

  getTags(ts: TagInterface[]): Tag[] {
    return ts.map((t: TagInterface): Tag => {
      return this.getTag(t);
    });
  }

  getTag(t: TagInterface): Tag {
    return new Tag().fromInterface(t);
  }

  getPhotos(ps: PhotoInterface[]): Photo[] {
    return ps.map((p: PhotoInterface): Photo => {
      return this.getPhoto(p);
    });
  }

  getPhoto(p: PhotoInterface): Photo {
    return new Photo().fromInterface(p);
  }

  getUser(u: UserInterface): User {
    return new User().fromInterface(u);
  }
}
