import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.css']
})
export class GameControlComponent implements OnInit {
  intervalId: number;
  incrementingNumber: number = 0;
  @Output() intervalFired = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  startGame() {
    this.intervalId = window.setInterval(() => {
      this.intervalFired.emit(this.incrementingNumber++);
    }, 1000);
  }

  stopGame() {
    window.clearInterval(this.intervalId);
  }

}
