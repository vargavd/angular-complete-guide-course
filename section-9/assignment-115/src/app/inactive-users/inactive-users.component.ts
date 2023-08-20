import { Component, OnInit } from '@angular/core';
import { Status, User } from '../models/user.model';
import { UsersService } from '../services/users.service';
import { CounterService } from '../services/counter.service';

@Component({
  selector: 'app-inactive-users',
  templateUrl: './inactive-users.component.html',
  styleUrls: ['./inactive-users.component.css']
})
export class InactiveUsersComponent implements OnInit {
  users: User[];

  constructor(private usersService: UsersService, private counterService: CounterService) { }

  ngOnInit(): void {
    this.users = this.usersService.users; // reference
  }

  getInactiveUsers(): User[] {
    return this.users.filter(user => user.status === Status.INACTIVE);
  }

  activateUser(user: User) {
    this.usersService.setUserStatus(user.name, Status.ACTIVE);
    this.counterService.incrementActivationsNumber();
  }
}
