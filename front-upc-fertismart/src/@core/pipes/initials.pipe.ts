import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials'
})
export class InitialsPipe implements PipeTransform {
  transform(value: string): any {
    return value
      ?.split(' ').length > 2 ?
      value
      ?.split(' ')
      .splice(0, value?.split(' ').length - (value?.split(' ').length - 2))
      .map(n => n[0].toUpperCase())
      .join('') :
      value
      ?.split(' ')
      .map(n => n[0].toUpperCase())
      .join('')
  }
}
