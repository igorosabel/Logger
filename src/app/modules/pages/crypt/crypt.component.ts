import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params, RouterModule } from "@angular/router";
import { MaterialModule } from "src/app/modules/material/material.module";
import { CryptoService } from "src/app/services/crypto.service";

@Component({
  standalone: true,
  selector: "app-crypt",
  templateUrl: "./crypt.component.html",
  styleUrls: ["./crypt.component.scss"],
  imports: [MaterialModule, RouterModule, FormsModule],
})
export default class CryptComponent implements OnInit {
  username: string;
  encrypt: string = "";
  encryptedResult: string = "";
  decrypt: string = "";
  decryptedResult: string = "";

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

  encryptText(): void {
    this.encryptedResult = this.crypto.encrypt(this.encrypt);
  }

  copyEncrypted(): void {
    navigator.clipboard.writeText(this.encryptedResult);
    this.snackBar.open("¡Resultado copiado!", "", {
      duration: 3000,
    });
  }

  decryptText(): void {
    this.decryptedResult = this.crypto.decrypt(this.decrypt);
  }

  copyDecrypted(): void {
    navigator.clipboard.writeText(this.decryptedResult);
    this.snackBar.open("¡Resultado copiado!", "", {
      duration: 3000,
    });
  }
}
