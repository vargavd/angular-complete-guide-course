import { Injectable } from '@angular/core';
import { Status, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  users: User[] = [
    new User('Max', Status.ACTIVE),
    new User('Manu', Status.ACTIVE),
    new User('Anna', Status.INACTIVE),
    new User('Chris', Status.INACTIVE),
  ];

  setUserStatus(name: string, status: Status) {
    const user = this.users.find(user => user.name === name);
    if (user) {
      user.status = status;
    }
  }
}