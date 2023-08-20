import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CounterService {
  toActiveCounter = 0;
  toInactiveCounter = 0;

  incrementActivationsNumber() { 
    this.toActiveCounter++;
  }

  incrementDeactivationsNumber() { 
    this.toInactiveCounter++;
  }

  getActivationsNumber() {
    return this.toActiveCounter;
  }

  getDeactivationsNumber() {
    return this.toInactiveCounter;
  }
}