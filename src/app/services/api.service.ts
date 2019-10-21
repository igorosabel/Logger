import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable }              from '@angular/core';
import { Observable }              from 'rxjs';
import { environment }             from '../../environments/environment';

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

  constructor(private http : HttpClient){}

  login(data: LoginData): Observable<LoginResult> {
    return this.http.post<LoginResult>(this.apiUrl + 'login', data);
  }
  
  register(data: RegisterData): Observable<LoginResult> {
    return this.http.post<LoginResult>(this.apiUrl + 'register', data);
  }
}