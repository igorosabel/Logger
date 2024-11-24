import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorttext',
})
export default class ShortTextPipe implements PipeTransform {
  transform(str: string, length: number = 50): string {
    return str.length > length ? str.substring(0, length) + '...' : str;
  }
}
