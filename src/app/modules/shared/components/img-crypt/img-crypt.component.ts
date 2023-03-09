import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { PhotoDataResult } from "src/app/interfaces/interfaces";
import { Photo } from "src/app/model/photo.model";
import { CryptoService } from "src/app/services/crypto.service";

@Component({
  standalone: true,
  selector: "app-img-crypt",
  templateUrl: "./img-crypt.component.html",
  styleUrls: ["./img-crypt.component.scss"],
  imports: [CommonModule],
})
export class ImgCryptComponent implements OnInit {
  @Input() photo: Photo = null;
  status: string = "loading";
  data: string = "";

  constructor(private http: HttpClient, private crypto: CryptoService) {}

  ngOnInit(): void {
    this.getData(this.photo.url).subscribe((result: PhotoDataResult): void => {
      this.data = this.crypto.decrypt(result.photo);
      this.status = result.status;
    });
  }

  public getData(url: string): Observable<PhotoDataResult> {
    return this.http.get<PhotoDataResult>(url, {});
  }
}
