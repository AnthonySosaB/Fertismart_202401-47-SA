import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyPeru'
})
export class CurrencyPeruPipe implements PipeTransform {
  transform(value: number): string {
    if (!value && value !== 0) return '';

    const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    
    return `S/ ${formattedValue}`;
  }
}