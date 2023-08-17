# Angular notes

> <sub>Sidenote: to install the old projects from Max's course - use `--legacy-peer-deps`</sub>

## angular app creation with cli

_First make sure that the latest nodejs and npm is installed_

1. Install angular cli: `npm install -g @angular/cli`
2. Create the app: `ng new my-angular-application`, or with no strict mode: `ng new my-angular-application --no-strict`

> <small>Use the `--skip-git` rule also to skip git initialization</small>

3. Go to the dir: `cd my-angular-application`
4. Start the app: `ng serve`

_When we start the app, the CLI will host the development server which runs the app itself._

> <sub>Sidenote: _adding a global css file_: in the `angular.json` file, add the file's path to the architect/build/styles array</sub>

> <sub>Sidenote 2: the folder name (`my-angular-application` in the prev example) cannot contain **space** or the word **test**</sub>

**Problems with `npm install` for older projects:** try `npm install --legacy-peer-depps`

_The server first serves index.html, then the first code that is executed is the `main.ts` file. Here the angular application is bootstrapped and starts the app module, which then starts the app component. The app component selector `app-root` is in the `index.html`, and this 'tag' will be replaced by the template. On the other hand, the other child components selectors will be in their parent template, not in the index.html!_

_The scripts are injected automatically to the index.html during `ng serve`. Reminder: Angular **is** a JS framework which task is to change the HTML in the end._

## How to display a variable's value?

Just declare a variable in the component, like
`name = 'Daniel'`
and then double curly brackets in the template
`{{ name }}`

_Angular uses decorators to define modules and components, and some of its properties like template, selector, imports..._

> <small>_Sidenote:_ `src/style.(s)css` is used for global styles, for the entire application.</small> > <small>_Sidenote 2:_ in the `angular.json` file, global stylesheets can be added to `projects > architect > build > options > styles`. If you changed something in the `angular.json` file, you have to restart the application with `ng serve`</small>

## `@Component` decorator:

_In order to tell Angular that a class is a Component, it needs a `Component` decorator._

- **Selector:** the unique html "tag" or a unique "tag attribute", or a css class <- this selects the elements that will be replaced with the component template

<sub>`Sidenote:` id and pseudo selectors like :hover won't work</sub>

> <small>**Sidenote2:** this unique selector needs to be added to any template (html file or template literal string)</small>

- **templateUrl** or **template**: the relative url the template file or an inline template (one of them is required). The inline template can be multline with ``.
- **styleUrls** or **styles**: both array, same difference as with _templateUrl_ & _template_

_In order to use a component, we need to add it to a module (usually AppModule) decorator, in the declaration array._

_Modules_ are used for bundling components. But for smaller projects, it is perfect to use only the app module.

## `@NgModule` decorator:

- **declarations:** array of component registrations used in that module or in its components
- **bootstrap:** select the _starter_ component, which will be initialized first
- **import:** allows to add other modules to this module (so we will be able to use functionalities from them)

## How to generate component with CLI

<sub>_These will add the new component to the app directory. The component will be in its own directory. The **CLI** will also add the declaration to the app module. _</sub>

1. `ng generate component my-component`
2. `ng g c my-component`

## Databinding

_Communication between code and template_

### Output Data

- **string interpolation:** `{{ data }}`
  - Between the curly brackets you can write any typescript expression that can be resolved to a string, but cant write multline expression ("block expressions")
- **property binding:** `[property]="data"`
  - this sets the underlying DOM element's property, so property here is not an attribute
  - this can be used instead of string interpolation, with the `[innerText]="variableName"` syntax
  - between "" it can be a javascript expression as well, it needs to be resolved with a appropriate type (=it must return a value with the appropriate type)
  - besides property, we can bind directives and components as well (coming later in the course)

### Event handling

- **Event Binding:** `(event)="javascript expression"`
  - here you don't write `(onclick)`, but `(click)`, so you have to omit the on in the event names - because you doN't write attributes here either, you bind the underlying DOM element's property
  - the `javascript expression` is **executed**. It means that if you write a function, you have to use parenthesis, like `(onclick)="clickedEventHandlerFunc()"`
  - **$event** is a variable you can use when using event binding, betweem "" - this will be the data emitted in the event

### Both

- **Two Way Binding (for an input for example):** `[(ngModel)]="variable"`
  - `ngModel` is a special angular directive

> <small>_Sidenote:_ in order to use `ngModel`, we need to import `FormsModule` </small>

## Directives

- **Directives**: instructions in the DOM
  - for example components "selector" are also `directives` with a template
  - usually `directives` are used as html attributes - it means that the directives selector is something like `[attributeName]`
  - **we will dive into directives later**

### Some important built-in directives:

#### **\*ngIf**

If statement (star means it is a structural directive, so it changes the DOM)

```
<p *ngIf="js expression that returns a boolean">
  Content that is displayed conditionally
</p>
```

or with an alternative syntax with else:

```
<p *ngIf="serverCreated; else noServer">Server was created, server name is {{ serverName }}</p>
<ng-template #noServer>
  <p>No server was created!</p>
</ng-template>
```

<sub>'#' <- local reference. Mark a certain spot in the DOM</sub>
<sub>The non structural directives are the attribute directives (with no asterisk) - they only change the element they are placed on</sub>

#### **[ngStyle]**

Attribute directive. The directive here is just `ngStyle`. Here the brackets indicate that we bind a property of this directive, and this property name is also `ngStyle`! It gets a javascript object. Example:

```
<p [ngStyle]="{backgroundColor: getColor()}">...content...</p>
```

#### **[ngClass]**

Attribute directive. Allow us to dynamically add or remove classes from an element.
It accepts an object, where the keys are the classes, the valuea are the conditions whether the class should be added or not.
Property binding: we need to pass a js object to the ngClass property of the ngClass directive!!

```
<div [ngClass]="{active: id === selectedId}">...content...</div>
```

#### **\*ngFor**

Structural directive

```
  <div *ngFor="let server of servers">...content...</div>
```

For using the index:

```
  <div *ngFor="let server of servers; let i = index>... </div>
```
