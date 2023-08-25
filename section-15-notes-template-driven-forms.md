# Section 13 - Forms in Angular

_Angular gives a javascript object representation of the form!_

Two approach:

- **Template driven**: you set up the form in the template and angular "parses" them and create the form object. It uses two way data-binding with directives (`ngModel`, `ngForm` and `ngModelGroup`) and local reference.
- **Reactive**: the form is created programatically and synchronized with the DOM. Here you create the form object **and** the html form code as well and manually connect the two! (**CLARIFICATION NEEDED**)

_The form doesn't have an action attribute - as it is not submitted by the browser._

> <small>Clicking on angular forms submit button does not result a submit and a http request (GET or POST). Instead of a request, this event is handled by angular.</small>

## Template driven forms

The `FormsModule` is needed to be imported in the app.module.ts for the template driven approach. In that case, Angular will automatically create the form represtatiion object.

```
  import { FormsModule } from '@angular/forms';

  @NgModule({
    ...
    imports: [
      FormsModule
    ...
  })
```

_With that import, Angular will create the representation object of a form automatically, as the `ngForm` directive has a `form` selector. This representation object will be type of `NgForm`. BUT: it will not have the inputs._

_For adding the input values to the `NgForm`, we have to set the name attribute and add the `ngModel` directive to each input. If we add the `ngModel` directive without parenthesis, it will only add the input value to the `NgForm` object. We can add it like `[ngModel]="initialValue"`, in that case we define the initial value of the control (one way databinding). If we add it with `([ngModel])="inputVal"`, this is two way databinding._

> <small>_The name attribute will be the name of the input's property in the `ngForm` object._</small>

**Submit the form**

Handling the submit, we need the `ngSubmit` directive on the form DOM element, but it doesn't give us the form object.

_To the get this `NgForm` form object, first you have to create a local reference on the form element, like this `#myForm="ngForm`. It makes the local reference equal to the automatically created `NgForm` object. It tells Angular pls give me access the form object you created automatically.
Then give this myForm reference to the submit handler func as a parameter:
`(ngSubmit)="onSubmit(myForm)`_

```
  // ... in the template
  <form (ngSubmit)="onSubmit()" #myForm="ngForm">

  // .. in the controller ts file
  onSubmit(form: NgForm) {
    console.log(form); // in the printed obhect, there is a value object which contains the current form values with names as keys and values entered in the form.
  }
```

> <small>The `NgForm` type has many information about the form. It contains the input controls, its validity and changed/unchanged status (f.e. dirty) too.</small>

**You can also use the `ViewChild` decorator to get this `local reference` as an `NgForm` property:**

```
  // in the template
  <form #f="ngForm">

  // in the controller
  @ViewChild('f') ourFormObject: NgForm;
```

_In that way you can also get the form object before submit._

> <small>_Sidenote:_ I think this `ViewChild` method is much cleaner to access the generated form object...</small>

## Validation

There are some built-in validator directives in angular (`required` or `email` fe). **required** is not actually a directive, it is a normal html attribute, it just triggers an angular directive which has the `required` selector.

Angular tracks the validity on the form level (overall) and on for the individual controls also. They can be found in the `NgForm` object. Also angular adds some classes to the inputs as well: `ng-dirty ng-touched ng-valid ng-invalid` for example.

> <small> [Built in Angular Validators](https://angular.io/api/forms/Validators). For the directive versions (which we need to use in the template driven approach, search for **validator** here: https://angular.io/api?type=directive) </small>

> <small>**Sidenote:** Angular disables HTML5 validation by default. This is the built-in validation in the browsers.</small>

### Some real world examples for validation

We can disable a button until the form is valid:

```
  // here f is the local reference for the form, and we bind the disabled property of the inner DOM object (so not the disabled attribute)
  <button [disabled]="!f.valid">Submit</button>
```

Adding a red border for an empty input, if the user has already "touched" it

```
  input.ng-invalid.ng-touched { border: 1px solid red; }
```

Getting a reference to an input and use its validity properties, using a `local reference` and the `ngModel directive`:

```
  <input type="email" required email ngModel #email="ngModel">
  <span class="help-block" *ngIf="!email.valid && email.touched">
    Please enter a valid email!
  </span>
```

> <small>Here the `ngModel` exposes some additional information about the element.</small>

**You can store an NgModel representation of an input too in a local reference**

# ngModel - Property binding

ngModel can be used with one way property binding to set the default value, like this: `[ngModel]="foobar"` where `foobar` is a property of the component. A simple text value in single quote would also work.

ngModel can be used two way binding as well: `[(ngModel)]="propertyName"`. In that way, you can get the value of that input any time, no need for submit.

# Grouping values

We can group inputs together, and we also can get the validity of a group. To group inputs together, add `ngModelGroup` directive to a wrapper html tag.

```
<div ngModelGroup="userData">
...
</div>
```

In that case _userData_ will be on the `ngForm` object as a property upon submit. Angular also add _validity_ classes to that group element (`ng-valid`, `ng-dirty` and so on..) - we can style the group element based on validity.

_To get a group before submit, you can use a local reference as well._

```
<div ngModelGroup="userData" #userData="ngModelGroup">
...
</div>
```

# Working with radio buttons

Add `ngModel` to the input, add a normal `name` attribute and then bind the underlying DOM object's `value property`.

```
  <input
    type="radio"
    name="gender"
    ngModel
    [value]="gender"
  >
```

# Set form values

## Every input

If we have a reference of the form element, we can set the value of the whole form with the `setValue` method. We need to give the values in the correct group format:

```
  // in the html:
  <form #f="ngForm" ...>

  // declare viewchild property that points to this local reference, in the component
  @ViewChild('f') myForm: NgForm;

  // set value to every field
  this.myForm.setValue({
    userData: {
      username: suggestedName,
      email: ''
    },
    secret: 'pet',
    questionAnswer: '',
    gender: 'male'
  });
```

## A specific input

With that method, you can override only a specific value in the form with `patchValue`. This is a method of the form property in the reference.

```
  // getting a local reference of the form in the template
  <form #f="ngForm">

  // declare viewchild property that points to this local reference, in the component
  @ViewChild('f') myForm: NgForm;

  // set value to a specific input
  this.myForm.form.patchValue({
    email: 'test@test.com'
  });
```

# Reset the form

Use the `reset` method of the form object to reset the values and the state (validity).
