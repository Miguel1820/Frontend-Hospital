import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'uuid', standalone: true })
export class UUIDPipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.substring(0, 8) : '';
  }
}