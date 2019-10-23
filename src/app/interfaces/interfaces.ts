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

export interface LoginResult {
	status: string;
	id: number;
	username: string;
	token: string;
}

export interface RegisterData {
	username: string;
	pass: string;
	conf: string;
}

export interface TagInterface {
	id: number;
	name: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
}

export interface EntryInterface {
	id: number;
	title: string;
	slug: string;
	body: string;
	createdAt: string;
	updatedAt: string;
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