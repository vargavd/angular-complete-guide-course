import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCounter, selectDoubleCount } from '../store/counter-selectors';


@Component({
  selector: 'app-counter-output',
  templateUrl: './counter-output.component.html',
  styleUrls: ['./counter-output.component.css'],
})
export class CounterOutputComponent {
  count$: Observable<number>;
  doubleCount$: Observable<number>;

  constructor(private store: Store<{counter: number}>) {
    this.count$ = store.select(selectCounter);
    this.doubleCount$ = store.select(selectDoubleCount);
  }
}
