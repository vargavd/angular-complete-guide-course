import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs-compat';

@Injectable({providedIn: 'root'}) // This is the same as adding this service to the providers array in app.module.ts
export class UserService {
  activatedEmitter = new Subject<boolean>();
}