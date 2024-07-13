export interface DataShareGlobals {
  [key: string]: any;
}

export interface DialogField {
  title: string;
  type: string;
  value: string;
  hint?: string;
}

export interface DialogOptions {
  title: string;
  content: string;
  fields?: DialogField[];
  ok: string;
  cancel?: string;
}

export interface StatusResult {
  status: string;
}

export interface LoginData {
  username: string;
  pass: string;
}

export interface UserInterface {
  id: number | null;
  username: string | null;
  token: string | null;
  secret?: string | null;
}

export interface LoginResult {
  status: string;
  user: UserInterface;
}

export interface RegisterData {
  username: string;
  pass: string;
  conf: string;
}

export interface HomeDataRequest {
  day: number;
  month: number;
  year: number;
  tags: number[];
  first: boolean;
}

export interface HomeDataInterface {
  status: string;
  calendar: string[];
  tags: TagInterface[];
  entries: EntryInterface[];
}

export interface TagInterface {
  id: number | null;
  name: string | null;
  num: number;
  createdAt: string | null;
  updatedAt: string | null;
  isPublic: boolean;
}

export interface EntryInterface {
  id: number | null;
  title: string | null;
  body: string | null;
  isPublic: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  tags: TagInterface[];
}

export interface EntriesResult {
  status: string;
  list: EntryInterface[];
}

export interface EntryResult {
  status: string;
  entry: EntryInterface;
}

export interface TagsResult {
  status: string;
  list: TagInterface[];
}

export interface TagEntriesResult {
  status: string;
  tag: TagInterface;
  list: EntryInterface[];
}

export interface PhotoInterface {
  id: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PhotosResult {
  status: string;
  list: PhotoInterface[];
}

export interface PhotoUploadResult {
  status: string;
  photo: PhotoInterface;
}

export interface PhotoDataResult {
  status: string;
  photo: string;
}
