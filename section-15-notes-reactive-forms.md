# Section 13 - Reactive Forms

_Here the form is created programatically, in TS code._

> <small>Sidenote: `FormsModule` is not needed for reactive forms. We need to import `ReactiveFormsModule` instead.</small>

## Create the form object

The form object we need to create will be type of `FormGroup`. You need to initialise it **before** the template is rendered (for example in the `ngOnInit` lifecycle hook).

```
  signupForm: FormGroup;

  ngOnInit() {
    this.signupForm = new FormGroup({});
  }
```

We insert an object to the `FormGroup` constructor which has the controls as property.

```
  new FormGroup({
      'username': new FormControl('user),
      'email': new FormControl(null),
      'gender': new FormControl('male')
      ...
    });
```

> <small>It is a good idea use strings as property name so during minimification they are kept</small>

## Connect the created form object to HTML

`FormControl` constructor accepts 3 params: the initial value, the validators and the async validators.

To connect the created `FormGroup` property with the actual form DOM element, we need to use the `formGroup` directive and bind (its property) to our `FormGroup` property.

```
  <form [formGroup]="signupForm">
```

> <small>_Sidenote: this will also tell angular don't create the form object automatically._</small>

### Connect the controls

To connect the inputs/selects/etc controls to the created form properties, use the `formControlName` directive and give if the property name.

```
  <input formControlName="username">
```

> <small>Here we don't use brackets, so we can add a simple string as value. But in reality, this is actualy this: [formControlName]="'username'"</small>

## Submit the form

To subscribe to submission, we use the same `ngSubmit` directive we used in the template forms.

```
  <form (ngSubmit)="onSubmit()">
```

## Validation in Reactive forms

You can add a validator to a control, as the second parameter of the `FormCOntrol`.

```
  'username': new FormControl(null, Validators.required);
```

> <small>`Validator.required` is actually a method, but we don't call it here</small>

### Multiple Validators on control

To add multiple, add an array of Validators as second parameter.

```
  'email': new FormControl(null, [Validators.required, Validators.email]),
```

### Use validation status in the template

You can get the validation status of a control with the `get` method of the created form object. For example display an error message based on a control status:

```
  <span
    class="help-block"
    *ngIf="!signupForm.get('username').valid && signupForm.get('username').touched"
  >
    Please enter a valid username!
  </span>
```

This can be used to check the whole form validity as well.

```
  <span
    class="help-block"
    *ngIf="!signupForm.valid && signupForm.touched"
  >
    Please enter a valid data!
  </span>
```

## Grouping

To have a group inside a form object, use the `FormGroup` object again - this will be a nested `FormGroup` inside the form which is also typed `FormGroup`. Inception.

```
  new FormGroup({
    'userData': new FormGroup({
      'username': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
    }),
  ...
```

We need to update the template as well. Create a wrapper div around the "nested" controls, with a `formGroupName` directive which equals to the group property name in the form object.

```
  <div formGroupName="userData">
    ... // username and email
  </div>
```

Plus we need to update the `get` calls and give them the appropriate "path" to the control:

```
  <span
    *ngIf="!signupForm.get('userData.username').valid && signupForm.get('userData.username').touched"
  >
```

## Array of controls (inputs)

To create an array of controls use the type `FormArray`. But it has a strange pattern.

First create a property of this type in the `FormGroup`.

```
  this.form = new FormGroup({
    ...
    'hobbies': new FormArray([]);
  })
```

To List the controls, you need a wrapper div with a `formArrayName` directive, and inside that div there should be another one with `ngFor` where the real list "happens". And inside that, just add the index to the `formControlName` directive of an input:

```
<div formArrayName="hobbies">
  <div *ngFor="let hobbyControl of getControls(); let i = index">
    <input [formControlName]="i">
  </div>
```

Sidenote: due to some limitation, for that to work you have to create an additional function for getting the controls:

`getControls: () => (<FormArray>this.signupForm.get('hobbies')).controls;`

When adding a new control to the array, you have to cast the return value of the get manually:

```
  (<FormArray>this.form.get('hobbies')).push(new FormControl(null, Validators.required));
```

## Custom validator

A custom validator is just a function that gets a `FormControl` object and returns null for valid value and an object with a `true` property if the value is invalid:

```
  validFunc(control: FormControl): {[s: string]: boolean} {
    // if invalid
    return { 'nameIsInvalid': true };

    // if valid
    return null;
  }
```

Then add this function to the second parameter of `FormControl` constructor:

```
  new FormGroup({
    ...
    'someControl': new FormControl(null, this.validFunc.bind(this)),
    ...
  })
```

Binding `this` is required if you use the `this` keyword inside the function.

The key which is returned when the control is invalid (`nameIsInvalid` in the last example) is in the errors array of the control object, in the form object, but only if it is invalid.

### Custom async validator

To create an async validator, the pattern is very similar to the sync one, only you have to return a `Promise` or an `Observable` in the validator func, resolve an object or null (depending on the valid status) and then add this func to the 3 parameter of the `FormControl` constructor.

```
  // the validator func:
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

  // in the FormGroup constructor:
  ...
  'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
  ...
```

## Listening to any change in the form

### Subscribe to any value change

You can listen to any value change in the form. Here we print to console the whole form value with every change (keystroke, select change etc...)

```
  this.signupForm.valueChanges.subscribe(
    (value) => console.log(value)
  );
```

> <small>**Sidenote:** you can subscribe for any change in the individual FormControls as well</small>

### Listen to validity change

Very similar to the value change:

```
  this.signupForm.statusChanges.subscribe(
    (status) => console.log(status)
  );
```

## Update the form with `setValue` and `patchValue`

They work the same as in the template driven approach.

```
  // update the whole form
  this.signupForm.setValue({
    'userData': {
      'username': 'Max',
      'email': 'test2@test.com'
    },
    'gender': 'male',
    'hobbies': []
  });

  // update only a part of the form
  this.signupForm.patchValue({
    'userData': {
      'username': 'Anna'
    }
  });
```

**We can also reset the form: `this.signupForm.reset();`**
