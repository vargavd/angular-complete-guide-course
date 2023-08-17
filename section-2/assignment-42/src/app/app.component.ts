import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
    .white-color {
      color: white;
    }
  `]
})
export class AppComponent {
  showParagraph = false;
  toggleLog = [];

  toggleParagraph() {
    this.showParagraph = !this.showParagraph;

    // this.toggleLog.push(this.toggleLog.length);
    this.toggleLog.push(new Date());
  }
}
