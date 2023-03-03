import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

import {
  EntriesResult,
  EntryInterface,
  EntryResult,
  LoginData,
  LoginResult,
  PhotosResult,
  PhotoUploadResult,
  RegisterData,
  StatusResult,
  TagEntriesResult,
  TagsResult,
} from "src/app/interfaces/interfaces";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(data: LoginData): Observable<LoginResult> {
    return this.http.post<LoginResult>(this.apiUrl + "login", data);
  }

  register(data: RegisterData): Observable<LoginResult> {
    return this.http.post<LoginResult>(this.apiUrl + "register", data);
  }

  getEntries(): Observable<EntriesResult> {
    return this.http.post<EntriesResult>(this.apiUrl + "getEntries", {});
  }

  getEntry(id: number): Observable<EntryResult> {
    return this.http.post<EntryResult>(this.apiUrl + "getEntry", { id });
  }

  getPublicEntry(id: number): Observable<EntryResult> {
    return this.http.post<EntryResult>(this.apiUrl + "getPublicEntry", { id });
  }

  getTags(): Observable<TagsResult> {
    return this.http.post<TagsResult>(this.apiUrl + "getTags", {});
  }

  saveEntry(entry: EntryInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + "saveEntry", entry);
  }

  getTagEntries(id: number): Observable<TagEntriesResult> {
    return this.http.post<TagEntriesResult>(this.apiUrl + "getTagEntries", {
      id,
    });
  }

  deleteEntry(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + "deleteEntry", { id });
  }

  getPhotos(id: number): Observable<PhotosResult> {
    return this.http.post<PhotosResult>(this.apiUrl + "getPhotos", { id });
  }

  uploadPhoto(id: number, photo: string): Observable<any> {
    return this.http.post<PhotoUploadResult>(
      this.apiUrl + "uploadPhoto",
      { id, photo },
      {
        reportProgress: true,
        observe: "events",
      }
    );
  }

  deletePhoto(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + "deletePhoto", { id });
  }
}
