import { Injectable } from "@angular/core";
import { EntryInterface, TagInterface } from "@interfaces/interfaces";
import { UserService } from "@services/user.service";
import { Utils } from "@shared/utils.class";

@Injectable({
  providedIn: "root",
})
export class CryptoService {
  constructor(private us: UserService) {}

  async getCryptoKeyFromHexString(hexKey: string): Promise<CryptoKey> {
    // Convierte la clave hexadecimal a una clave binaria
    const keyBuffer = new Uint8Array(
      hexKey.match(/.{1,2}/g).map((byte: string): number => parseInt(byte, 16))
    );

    // Importa la clave binaria
    const key: CryptoKey = await window.crypto.subtle.importKey(
      "raw",
      keyBuffer,
      "AES-GCM",
      true,
      ["encrypt", "decrypt"]
    );

    return key;
  }

  arrayBufferToBase64(arrayBuffer: ArrayBufferLike): string {
    const byteArray = new Uint8Array(arrayBuffer);
    let binary = "";
    for (let i = 0; i < byteArray.byteLength; i++) {
      binary += String.fromCharCode(byteArray[i]);
    }
    return btoa(binary);
  }

  async encryptText(data: string, keyText: string): Promise<string> {
    if (data === "") {
      return "";
    }
    const key: CryptoKey = await this.getCryptoKeyFromHexString(keyText);
    const dataBuffer: Uint8Array = new TextEncoder().encode(data);
    const encryptedData: ArrayBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        //iv: window.crypto.getRandomValues(new Uint8Array(12)),
        iv: new Uint8Array(12),
      },
      key,
      dataBuffer
    );

    // Convertir los datos cifrados a base64
    const encryptedArray = new Uint8Array(encryptedData);
    const encryptedBase64: string = this.arrayBufferToBase64(encryptedArray);

    return encryptedBase64;
  }

  async decryptText(encryptedBase64: string, keyText: string): Promise<string> {
    if (encryptedBase64 === "") {
      return "";
    }
    let decryptedText: string = "";
    try {
      const key: CryptoKey = await this.getCryptoKeyFromHexString(keyText);
      const encryptedData: ArrayBufferLike = new Uint8Array(
        atob(encryptedBase64)
          .split("")
          .map((char: string): number => char.charCodeAt(0))
      ).buffer;
      const decryptedData: ArrayBuffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: new Uint8Array(12),
        },
        key,
        encryptedData
      );

      decryptedText = new TextDecoder().decode(decryptedData);
    } catch (error) {
      console.log(error);
    }

    return decryptedText;
  }

  async sha(text: string, longitudBits = 256): Promise<string> {
    const encoder = new TextEncoder();
    const data: Uint8Array = encoder.encode(text);

    // Calcular el hash SHA-256 (256 bits)
    const hashBuffer: ArrayBuffer = await crypto.subtle.digest("SHA-256", data);

    // Truncar el hash a la longitud deseada en bits
    const claveBuffer: ArrayBuffer = hashBuffer.slice(0, longitudBits / 8);

    // La clave generada en formato hexadecimal
    const claveHexadecimal: string = Array.from(new Uint8Array(claveBuffer))
      .map((byte: number): string => byte.toString(16).padStart(2, "0"))
      .join("");

    return claveHexadecimal;
  }

  encrypt(str: string): Promise<string> {
    return this.encryptText(str, this.us.user.secret.trim());
  }

  decrypt(str: string): Promise<string> {
    return this.decryptText(str, this.us.user.secret.trim());
  }

  async hash(str: string): Promise<string> {
    const hash: string = await this.sha(str);
    return hash;
  }

  async decryptTag(tag: TagInterface): Promise<TagInterface> {
    if (!tag.isPublic) {
      tag.name = await this.decrypt(Utils.urldecode(tag.name));
    }
    return tag;
  }

  async decryptTags(tags: TagInterface[]): Promise<TagInterface[]> {
    const tagList: TagInterface[] = [];
    for (const tag of tags) {
      tagList.push(await this.decryptTag(tag));
    }
    return tagList;
  }

  async decryptEntry(item: EntryInterface): Promise<EntryInterface> {
    if (!item.isPublic) {
      item.title = await this.decrypt(Utils.urldecode(item.title));
      item.body = await this.decrypt(Utils.urldecode(item.body));
      item.tags = await this.decryptTags(item.tags);
    }
    return item;
  }

  async decryptEntries(list: EntryInterface[]): Promise<EntryInterface[]> {
    const promesas: Promise<EntryInterface[]> = Promise.all(
      list.map(
        (item: EntryInterface): Promise<EntryInterface> =>
          this.decryptEntry(item)
      )
    );
    return promesas;
  }

  async encryptTags(tags: TagInterface[]): Promise<TagInterface[]> {
    const tagList: TagInterface[] = [];
    for (const tag of tags) {
      tag.name = await this.encrypt(tag.name);
      tagList.push(tag);
    }
    return tagList;
  }

  async encryptEntry(item: EntryInterface): Promise<EntryInterface> {
    if (!item.isPublic) {
      item.title = await this.encrypt(item.title);
      item.body = await this.encrypt(item.body);
      item.tags = await this.encryptTags(item.tags);
    }
    return item;
  }

  async encryptEntries(list: EntryInterface[]): Promise<EntryInterface[]> {
    const promesas: Promise<EntryInterface[]> = Promise.all(
      list.map(
        (item: EntryInterface): Promise<EntryInterface> =>
          this.encryptEntry(item)
      )
    );
    return promesas;
  }
}
