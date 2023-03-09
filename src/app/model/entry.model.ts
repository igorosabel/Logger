import { EntryInterface } from "src/app/interfaces/interfaces";
import { Utils } from "src/app/modules/shared/utils.class";
import { TagInterface } from "./../interfaces/interfaces";
import { Tag } from "./tag.model";

export class Entry {
  constructor(
    public id: number = null,
    public title: string = null,
    public body: string = null,
    public isPublic: boolean = false,
    public createdAt: string = null,
    public updatedAt: string = null,
    public tags: Tag[] = []
  ) {}

  addTag(tag: Tag): void {
    this.tags.push(tag);
  }

  loadTags(tags: string): void {
    if (tags == "") {
      this.tags = [];
      return;
    }
    const tagList: string[] = tags
      .split(",")
      .map((x: string): string => x.trim());
    for (let t of tagList) {
      let ind: number = this.tags.findIndex((x: Tag): boolean => x.name == t);
      if (ind == -1) {
        let tag = new Tag(null, t);
        this.addTag(tag);
      }
    }
    const newTagList: Tag[] = [];
    for (let t of this.tags) {
      let ind: number = tagList.findIndex((x: string): boolean => x === t.name);
      if (ind != -1) {
        newTagList.push(t);
      }
    }
    this.tags = newTagList;
  }

  get composed(): string {
    if (this.body === null) {
      return "";
    }
    let str: string = this.body;
    str = str.replace(new RegExp("\n", "g"), "<br>");

    str = str.replace(
      new RegExp("\\[b\\](.+?)\\[/b\\]", "g"),
      "<strong>$1</strong>"
    );
    str = str.replace(new RegExp("\\[i\\](.+?)\\[/i\\]", "g"), "<em>$1</em>");
    str = str.replace(new RegExp("\\[u\\](.+?)\\[/u\\]", "g"), "<u>$1</u>");

    str = str.replace(
      new RegExp("\\[l\\](.+?)\\[/l\\]", "g"),
      '<div class="align-left">$1</div>'
    );
    str = str.replace(
      new RegExp("\\[c\\](.+?)\\[/c\\]", "g"),
      '<div class="align-center">$1</div>'
    );
    str = str.replace(
      new RegExp("\\[r\\](.+?)\\[/r\\]", "g"),
      '<div class="align-right">$1</div>'
    );

    /*str = str.replace(
      new RegExp("\\[img\\](.+?)\\[/img\\]", "g"),
      '<img class="entry-photo" src="https://apilogger.osumi.es/api/getEntryPhoto/$1">'
    );*/

    return str;
  }

  get clean(): string {
    if (this.body === null) {
      return "";
    }
    let str: string = this.body;
    str = str.replace(new RegExp("\n", "g"), " ");

    str = str.replace(new RegExp("\\[b\\](.+?)\\[/b\\]", "g"), "$1");
    str = str.replace(new RegExp("\\[i\\](.+?)\\[/i\\]", "g"), "$1");
    str = str.replace(new RegExp("\\[u\\](.+?)\\[/u\\]", "g"), "$1");

    str = str.replace(new RegExp("\\[l\\](.+?)\\[/l\\]", "g"), "$1");
    str = str.replace(new RegExp("\\[c\\](.+?)\\[/c\\]", "g"), "$1");
    str = str.replace(new RegExp("\\[r\\](.+?)\\[/r\\]", "g"), "$1");

    str = str.replace(new RegExp("\\[img\\](.+?)\\[/img\\]", "g"), "");

    return str;
  }

  fromInterface(e: EntryInterface): Entry {
    this.id = e.id;
    this.title = Utils.urldecode(e.title);
    this.body = Utils.urldecode(e.body);
    this.isPublic = e.isPublic;
    this.createdAt = e.createdAt;
    this.updatedAt = e.updatedAt;
    this.tags = e.tags.map((t: TagInterface): Tag => {
      return new Tag().fromInterface(t);
    });

    return this;
  }

  toInterface(): EntryInterface {
    return {
      id: this.id,
      title: Utils.urlencode(this.title),
      body: Utils.urlencode(this.body),
      isPublic: this.isPublic,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      tags: this.tags.map((t: Tag): TagInterface => {
        return t.toInterface();
      }),
    };
  }
}
