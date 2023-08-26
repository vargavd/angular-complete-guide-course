import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames = ['Chris', 'Anna'];

  ngOnInit() {
    this.signupForm = new FormGroup({
      'userData': new FormGroup({ // This is a nested FormGroup
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]), // this.forbiddenNames is a custom validator
        'email': new FormControl(
          null, 
          [Validators.required, Validators.email],
          this.forbiddenEmails
        ),
      }),
      'gender': new FormControl('female'),
      'hobbies': new FormArray([]) // This is a nested FormArray
    });

    // this.signupForm.valueChanges.subscribe(
    //   (value) => console.log(value)
    // );

    this.signupForm.statusChanges.subscribe(
      (status) => console.log(status)
    );

    this.signupForm.setValue({
      'userData': {
        'username': 'Max',
        'email': 'test2@test.com'
      },
      'gender': 'male',
      'hobbies': []
    });

    this.signupForm.patchValue({
      'userData': {
        'username': 'Anna'
      }
    });

    // this.signupForm.reset();
  }

  onSubmit() {
    console.log(this.signupForm);
  }

  // *ngFor="let hobbyControl of getControls(); let i = index" 
  getControls() {
    return (<FormArray>this.signupForm.get('hobbies')).controls;
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    // (<FormArray>this.signupForm.get('hobbies')).push(control);
    // The above line is equivalent to the following
    (this.signupForm.get('hobbies') as FormArray).push(control);
  }

  forbiddenNames(control: FormControl): {[s: string]: boolean} {
    // return this if the form control is not valid
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden': true};
    }
    // return null it passes the test
    return null;
  }

  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({'emailIsForbidden': true}); // return this if the form control is not valid
        } else {
          resolve(null); // return null it passes the test
        }
      }, 1500);
    });

    return promise;
  }
}
