# Section 5

Installing course sample projects:
`npm install --legacy-peer-deps`

_Source maps_ allow browsers to connect (map) the downloaded javascript file to the typescript source on the server

## Pass data between components: `property binding` or `event binding`

### **Property binding** can be used to own custom properties

- A parent component can bind a child component's element, if this element has a **@Input() decorator**. Example:

```
// ... in the child component ts file:
@Input() element: {type: string, name: string, content: string};

// ... in the parent component html
<child-component [element]="elements[0]"></child-component>
```

- You can assign an alias to the property, so the "attribute" will be that alias:

```
// ... in the child component ts file:
  @Input('srvElement') element: {type: string, name: string, content: string};

// ... in the parent component html
<child-component [srvElement]="elements[0]"></child-component>
```

### Listening to custom event on components

- it is similar to the property binding, but in the child component the event "property" must be an EventEmitter

```
  // ... in the child component ts
  @Output('fancyEventName') customEvent = new EventEmitter<**payload type**>();

  // ... below in the child components ts
  this.customEvent.emit(payloadObject);

  // ... in the parent component html
  (fancyEventName)="onEvent($event)"

  // ... in the parent components ts
  onEvent(payload: PayloadType) { ... }

```

## View encapsulation

The css rules only apply to the component the css file belong to. The css rules applies to a specific attribute, which is the same within each component.

You can change view encapsulation mode this for each component with the `encapsulation` property in the `Component directive`.

- **`ViewEncapsulation.Emulated`:** default behaviour
- **`ViewEncapsulation.None`:** no special attribute is assigned to the component's elements. A css styles for this component will apply to every
- **`ViewEncapsulation.ShadowDom`:** same result as default with the built-in shadow dom browser technology (**but it is not supported everrwhere??**)

## Local Reference

Will hold to a reference to an HTML DOM element - you can use them **only** in the template, but we can give it to a function as a parameter!

## **There is another method to access the DOM elements from the component: the directive _ViewChild_**

You set the the "local reference" on any DOM element and then define a property in the component with the ViewChild directive. This property will has the `ElementRef` type. You give the reference name to the ViewChild function as a parameter:

```
  // ... in the html
  <input #inputReference>

  // ... in the ts file
  @ViewChild('inputReference', { static: true }) value:ElementRef;
```

_The second parameter is needed only if you want to use the `value` property in the ngOnInit function._
_ElementRef type has a nativeElement property which is the DOM element._

## `ng-content` directive (tag)

Place the `<ng-content></ng-content>` tag (angular directive) in your component - it will display the content that is between the opening and closing tag of your component. This is useful for example a tab component.

```
  // .. in the parent component html
  <your-component ...>
    <p>This will be displayed</p>
  </your component>

  // ... in the child component html
  <div class="content-from-above"><ng-content></ng-content></div>
```

# `Lifecycle`: A creation of the component, and angular give us a chance to hook into the different phases

<sub>Implementing the below functions would be enough. But it is a good practise to implement the corresponding interface - for example `implements OnInit, OnChanges`. It makes it clear which methods should be implmented in your component.</sub>

> <small>`Lifecycle hooks` only work on `Components` and `Directives`, so only the elements that Angular manages.</small>

## **ngOnChanges**

This hook runs at the creation of the component, plus every time an @Input() decorated property receives new value. This is the only hook that receives a parameter of type SimpleChanges.

> <sub>**A very important thing - when you pass an JS object to an Input property, it will pass the reference of this object. It means, a property change `will not` trigger the `ngOnChanges` hook, because the what was passed down has not been changed (the pointer, so to say)**</sub>

## **ngOnInit**

- Runs when the component has been initialized. You should do every property initializations here (according to a comment Max did in Section10 :P).
- Runs _after_ the constructor

## **ngDoCheck**

Runs at _every_ check, so every time angular checks if anything changed (for example you clicked or a timer runs). It runs many times, so don't do anything big.

## **ngAfterContentInit**

Runs after <ng-content> has been initialized/projected

## **ngAfterContentChecked**

Runs after <ng-content> has been checked by change detection.

## **ngAfterViewInit**

Runs after the view of our component has been initialized (including all the child components).

## **ngAfterViewChecked**

Runs when the view (and child views) have been checked

## **ngOnDestroy**

When it is destroyed (for example an if directive has been false in the parent)

# `@ContentChild` directive

It can be used to access a DOM element in the projected content our component got. This DOM element will be part of the `content` and not the `view` - hence the name **ContentChild** and not _ViewChild_

---

## angular app creation with cli

_First make sure that the latest nodejs and npm is installed_

1. Install angular cli: `npm install -g @angular/cli`
2. Create the app: `ng new my-angular-application`, or with no strict mode: `ng new my-angular-application --no-strict`
3. Go to the dir: `cd my-angular-application`
4. Start the app: `ng serve`

> <sub>Sidenote: _adding a global css file_: in the `angular.json` file, add the file's path to the architect/build/styles array</sub>

_The first code that is executed is the `main.ts` file. Here the angular application is bootstrapped and starts the app module, which then starts the app component. The app component selector "app-root" is in the index.html. On the other hand, the other child components selectors will be in their parent template, not in the index.html!_

## How to display a variable's value?

Just declare a variable in the component, like
`name = 'Daniel'`
and then double curly brackets in the template
`{{ name }}`

_Angular uses decorators to define modules and components, and some of its properties like template, selector, imports..._

## `@Component` decorator:

- **Selector:** the unique html "tag" or a unique "tag attribute", or a css class <- this selects the elements that will be replaced with the component template <sub>`Sidenote:` id and pseudo selectors like :hover won't work</sub>
- **templateUrl** or **template**: the relative url the template file or an inline template (one of them is required). The inline template can be multline with ``.
- **styleUrls** or **styles**: both array, same difference to the _templateUrl_ & _template_

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
  - Between the curly brackets you can write any typescript expression that can be resolved to a string, but cant write multline expression
- **property binding:** `[property]="data"`
  - this sets the underlying DOM element's property, so property here is not an attribute
  - this can be used insted of string interpolation, with the `[innerText]="variableName"` syntax

### Event handling

- **Event Binding:** `(event)="javascript expression"`
  - here you don't write `(onclick)`, but `(click)`, so you have to omit the on in the event names - because you doN't write attributes here either, you bind the underlying DOM element's property
  - the `javascript expression` is **executed**. It means that if you write a function, you have to use parenthesis, like `(onclick)="clickedEventHandlerFunc()"`
  - **$event** is a variable you can use when using event binding - this will be the data emitted in the event

### Both

- **Two Way Binding (for an input for example):** `[(ngModel)]="variable"`
  - `ngModel` is a special angular directive

## Directives

- **Directives**: instructions in the DOM
  - for example components are also `directives` with a template
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
<sub>The non structural directives are the attribute directives - they only change the element they are placed on</sub>

#### **[ngStyle]**

Attribute directive. Here the brackets indicate that we bind a property of the DOM element here! Example:

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
