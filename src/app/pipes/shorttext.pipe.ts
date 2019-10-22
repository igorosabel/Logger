import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorttext'
})
export class ShortTextPipe implements PipeTransform {
	transform(str: string, length: number = 50): string {
		return (str.length > length) ? str.substr(0, length)+'...' : str;
	}
}