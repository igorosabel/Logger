import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ModelSignal, OnInit, inject, model } from '@angular/core';
import { PhotoDataResult } from '@interfaces/interfaces';
import Photo from '@model/photo.model';
import CryptoService from '@services/crypto.service';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-img-crypt',
  templateUrl: './img-crypt.component.html',
  styleUrls: ['./img-crypt.component.scss'],
  imports: [CommonModule],
})
export default class ImgCryptComponent implements OnInit {
  private http: HttpClient = inject(HttpClient);
  private crypto: CryptoService = inject(CryptoService);

  photo: ModelSignal<Photo> = model.required<Photo>();
  type: ModelSignal<string> = model<string>('thumb');
  decrypt: ModelSignal<boolean> = model<boolean>(true);
  status: string = 'loading';
  data: string = '';

  ngOnInit(): void {
    this.getData(this.photo().url).subscribe(
      async (result: PhotoDataResult): Promise<void> => {
        if (this.decrypt()) {
          this.data = await this.crypto.decrypt(result.photo);
        } else {
          this.data = result.photo;
        }
        this.status = result.status;
      }
    );
  }

  public getData(url: string): Observable<PhotoDataResult> {
    return this.http.get<PhotoDataResult>(url, {});
  }
}
