import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Status, User } from '../models/user.model';
import { CounterService } from '../services/counter.service';

@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.css']
})
export class ActiveUsersComponent implements OnInit {
  users: User[];

  constructor(private usersService: UsersService, private counterService: CounterService) { }

  ngOnInit(): void {
    this.users = this.usersService.users; // reference
  }

  getActiveUsers(): User[] {
    return this.users.filter(user => user.status === Status.ACTIVE);
  }

  deactivateUser(user: User) {
    this.usersService.setUserStatus(user.name, Status.INACTIVE);
    this.counterService.incrementDeactivationsNumber();
  }
}
