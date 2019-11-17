import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable }              from '@angular/core';
import { Observable }              from 'rxjs';
import { environment }             from '../../environments/environment';
import { map }                     from 'rxjs/operators';
import { Entry }                   from '../model/entry.model';

import {
	LoginData,
	LoginResult,
	RegisterData,
	EntriesResult,
	EntryResult,
	TagsResult,
	TagEntriesResult,
	EntryImagesResult,
	StatusResult
} from '../interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	apiUrl = environment.apiUrl;

	constructor(private http : HttpClient){}

	login(data: LoginData): Observable<LoginResult> {
		return this.http.post<LoginResult>(this.apiUrl + 'login', data);
	}

	register(data: RegisterData): Observable<LoginResult> {
		return this.http.post<LoginResult>(this.apiUrl + 'register', data);
	}

	getEntries(): Observable<EntriesResult> {
		return this.http.post<EntriesResult>(this.apiUrl + 'getEntries', {});
	}

	getEntry(id: number): Observable<EntryResult> {
		return this.http.post<EntryResult>(this.apiUrl + 'getEntry', {id});
	}

	getTags(): Observable<TagsResult> {
		return this.http.post<TagsResult>(this.apiUrl + 'getTags', {});
	}

	saveEntry(entry: Entry): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiUrl + 'saveEntry', entry);
	}

	getTagEntries(id: number): Observable<TagEntriesResult> {
		return this.http.post<TagEntriesResult>(this.apiUrl + 'getTagEntries', {id});
	}
	
	deleteEntry(id: number): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiUrl + 'deleteEntry', {id});
	}
	
	getEntryImages(id: number): Observable<EntryImagesResult> {
		return this.http.post<EntryImagesResult>(this.apiUrl + 'getEntryImages', {id});
	}
}