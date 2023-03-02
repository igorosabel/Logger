import { Pipe, PipeTransform } from "@angular/core";
import { CommonService } from "src/app/services/common.service";

@Pipe({
  standalone: true,
  name: "urldecode",
})
export class UrldecodePipe implements PipeTransform {
  constructor(private cs: CommonService) {}

  transform(str: string): string {
    return this.cs.urldecode(str);
  }
}
