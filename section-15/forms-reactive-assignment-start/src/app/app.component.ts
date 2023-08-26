import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  projectForm: FormGroup;

  ngOnInit() {
    this.projectForm = new FormGroup({
      name: new FormControl(null, [Validators.required, this.noTestName], this.noFoobarNameAsync),
      email: new FormControl(null, [Validators.required, Validators.email]),
      status: new FormControl(null)
    });
  }

  onSubmit() {
    console.log(this.projectForm.value);
  }

  noTestName(control: FormControl): {[s: string]: boolean} {
    return control.value === 'Test' ? 
      {'noTestName': true} : null;
  }

  noFoobarNameAsync(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
          resolve(
            control.value.toLowerCase() === 'foobar' ? 
            { noFoobarNameAsync: true } : null
          );
      }, 1500);
    });

    return promise;
  }
}
