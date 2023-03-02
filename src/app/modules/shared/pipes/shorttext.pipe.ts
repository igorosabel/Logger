import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  standalone: true,
  name: "shorttext",
})
export class ShortTextPipe implements PipeTransform {
  transform(str: string, length: number = 50): string {
    return str.length > length ? str.substring(0, length) + "..." : str;
  }
}
