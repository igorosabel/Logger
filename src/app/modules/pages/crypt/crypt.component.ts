import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ActivatedRoute, Params, RouterModule } from "@angular/router";
import { CryptoService } from "@services/crypto.service";
import { Utils } from "@shared/utils.class";

@Component({
  standalone: true,
  selector: "app-crypt",
  templateUrl: "./crypt.component.html",
  styleUrls: ["./crypt.component.scss"],
  imports: [
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
  ],
})
export default class CryptComponent implements OnInit {
  username: string;
  encrypt: string = "";
  encryptedResult: string = "";
  decrypt: string = "";
  decryptedResult: string = "";
  urlencode: string = "";
  urlencodeResult: string = "";
  urldecode: string = "";
  urldecodeResult: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private crypto: CryptoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.username = params.username;
    });
  }

  async encryptText(): Promise<void> {
    this.encryptedResult = await this.crypto.encrypt(this.encrypt);
  }

  copyEncrypted(): void {
    navigator.clipboard.writeText(this.encryptedResult);
    this.snackBar.open("¡Resultado copiado!", "", {
      duration: 3000,
    });
  }

  async decryptText(): Promise<void> {
    this.decryptedResult = await this.crypto.decrypt(this.decrypt);
  }

  copyDecrypted(): void {
    navigator.clipboard.writeText(this.decryptedResult);
    this.snackBar.open("¡Resultado copiado!", "", {
      duration: 3000,
    });
  }

  urlencodeText(): void {
    this.urlencodeResult = Utils.urlencode(this.urlencode);
  }

  copyUrlencoded(): void {
    navigator.clipboard.writeText(this.urlencodeResult);
    this.snackBar.open("¡Resultado copiado!", "", {
      duration: 3000,
    });
  }

  urldecodeText(): void {
    this.urldecodeResult = Utils.urldecode(this.urldecode);
  }

  copyUrldecoded(): void {
    navigator.clipboard.writeText(this.urldecodeResult);
    this.snackBar.open("¡Resultado copiado!", "", {
      duration: 3000,
    });
  }
}
