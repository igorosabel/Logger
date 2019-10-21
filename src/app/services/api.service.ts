import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable }              from '@angular/core';
import { Observable }              from 'rxjs';
import { environment }             from '../../environments/environment';
import { map }                     from 'rxjs/operators';
import { Entry, EntryAdapter }     from '../model/entry.model';

import {
	LoginData,
	LoginResult,
	RegisterData
} from '../interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	apiUrl = environment.apiUrl;

	constructor(private http : HttpClient, private entryAdapter: EntryAdapter){}

	login(data: LoginData): Observable<LoginResult> {
		return this.http.post<LoginResult>(this.apiUrl + 'login', data);
	}

	register(data: RegisterData): Observable<LoginResult> {
		return this.http.post<LoginResult>(this.apiUrl + 'register', data);
	}

	getEntries(): Observable<Entry[]> {
		return this.http.post(this.apiUrl + 'getEntries', {}).pipe(
			map((data: any[]) => data.map(item => this.entryAdapter.adapt(item)))
		);
	}
}