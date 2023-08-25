# Section 13 - Reactive Forms

_Here the form is created programatically, in TS code._

---

_Angular gives a javascript object representation of the form!_

Two approach:

- **Template driven**: you set up the form in the template and angular "parses" them and create the form object. It uses two way data-binding with directives (`ngModel`, `ngForm` and `ngModelGroup`) and local reference.
- **Reactive**: the form is created programatically and synchronized with the DOM. Here you create the form object **and** the html form code as well and manually connect the two! (**CLARIFICATION NEEDED**)

> <small>Clicking on angular forms submit button does not result a submit, an http request (usually a POST). Instead of a request, this event is handled by angular.</small>

## Template driven forms

The `FormsModule` is needed to be imported in the app.module.ts for the template driven approach:

```
  import { FormsModule } from '@angular/forms';

  @NgModule({
    ...
    imports: [
      FormsModule
    ...
  })
```

_With that import, Angular will create the representation object of a form automatically, as the `ngForm` directive has a `form` selector. This representation object will be type of `NgForm`._

_For adding the input values to the `NgForm`, we have to set the name attribute and add the `ngModel` directive to each input. If we add the `ngModel` directive without parenthesis, it will only add the input value to the `NgForm` object. We can add it like `[ngModel]="initialValue"`, in that case we define the initial value of the control (one way databinding). If we add it with `([ngModel])="inputVal"`, this is two way databinding._

_But it will not detect the imputs automatically, you need to register them manually with adding `ngModel` directive to the inputs, but without ([parenthesis]) (so no signs of 2 way databinding). The name of that input will come from the normal html name attribute._

_To the get this `NgForm` form object, first you have to create a local reference on the form element, but like this `#myForm="ngForm`. So it make the local reference equal to the automatically created `NgForm` object. It tells Angular pls give me access the form object you created automatically.
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

> <small>The `NgForm` type has many information about the form. For example contains the input controls as well. Or the status of the form - for example is it dirty (unchanged) or is it valid.</small>

**You can also use the `ViewChild` decorator to this `local reference` as an `NgForm` property:**

```
  // in the template
  <form #f="ngForm">

  // in the controller
  @ViewChild('f') ourFormObject: NgForm;
```

_In that way you can get the form object before submit._

## Validation

There are some built-in validator directives in angular (`required` or `email` fe). **Required** is not actually a directive, it is a normal html attribute, it just triggers an angular directive as a selector.

Angular tracks the validity on the form level (overall) and on for the controls individually also. They can be found in the `NgForm` object. Also angular adds some classes to the inputs as well: 'ng-dirty ng-touched ng-valid ng-invalid' for example.

> <small> [Built in Angular Validators](https://angular.io/api/forms/Validators). For the directive versions (which we need to use in the template driven approach, search for **validator** here: https://angular.io/api?type=directive) </small>

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

**You can store an NgModel representation of an input too in a local reference**

# ngModel - Property binding

ngModel can be used with one way property binding to set the default value, like this: `[ngModel]="foobar"` where `foobar` is a property of the component. A simple text value in single quote would also work.

ngModel can be used two way binding as well: `[(ngModel)]="propertyName"`. In that way, you can get the value of that input any time, no need for submit.

# Grouping values

We can group inputs together, and we also can get the validity of a group. To group inputs together, add `ngModelGroup directive` to a wrapper html tag.

```
<div ngModelGroup="userData">
...
</div>
```

In that case userData will be on the `ngForm` object as a property upon submit.

_To get a group before submit, you can use a local reference as well._

```
<div ngModelGroup="userData" #userData="ngModelGroup">
...
</div>
```

# Set an input value with the reference of the form

```
  // getting a local reference of the form in the template
  <form #f="ngForm">

  // declare viewchild property that points to this local reference, in the component
  @ViewChild('f') myForm: NgForm;

  // set value to a specific input
  this.myForm.form.patchValue({
    email: 'test@test.com'
  });

  // set every value in the form
  this.myForm.setValue({
    ... set every input
  })
```
