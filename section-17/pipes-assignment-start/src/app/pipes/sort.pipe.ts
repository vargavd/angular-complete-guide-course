import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(values: [], propName: string): unknown {
    return values.sort((a, b) => {
      if (a[propName] > b[propName]) {
        return 1;
      } else if (a[propName] < b[propName]) {
        return -1;
      } else {
        return 0;
      }
    });
  }

}
