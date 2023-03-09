import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";
import { EntryInterface, TagInterface } from "src/app/interfaces/interfaces";
import { Utils } from "src/app/modules/shared/utils.class";
import { UserService } from "src/app/services/user.service";

@Injectable({
  providedIn: "root",
})
export class CryptoService {
  constructor(private us: UserService) {}

  encrypt(str: string): string {
    return CryptoJS.AES.encrypt(str, this.us.user.secret.trim()).toString();
  }

  decrypt(str: string): string {
    return CryptoJS.AES.decrypt(str, this.us.user.secret.trim()).toString(
      CryptoJS.enc.Utf8
    );
  }

  hash(str: string): string {
    return CryptoJS.SHA1(str).toString();
  }

  decryptEntry(item: EntryInterface): EntryInterface {
    if (!item.isPublic) {
      item.title = this.decrypt(Utils.urldecode(item.title));
      item.body = this.decrypt(Utils.urldecode(item.body));
      const tagList: TagInterface[] = [];
      for (let tag of item.tags) {
        tag.name = this.decrypt(Utils.urldecode(tag.name));
        tagList.push(tag);
      }
      item.tags = tagList;
    }
    return item;
  }

  decryptEntries(list: EntryInterface[]): EntryInterface[] {
    return list.map((item: EntryInterface): EntryInterface => {
      return this.decryptEntry(item);
    });
  }

  encryptEntry(item: EntryInterface): EntryInterface {
    if (!item.isPublic) {
      item.title = this.encrypt(item.title);
      item.body = this.encrypt(item.body);
      const tagList: TagInterface[] = [];
      for (let tag of item.tags) {
        tag.name = this.encrypt(tag.name);
        tagList.push(tag);
      }
      item.tags = tagList;
    }
    return item;
  }

  encryptEntries(list: EntryInterface[]): EntryInterface[] {
    return list.map((item: EntryInterface): EntryInterface => {
      return this.encryptEntry(item);
    });
  }
}
