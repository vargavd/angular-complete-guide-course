# Section 7 - Directives Deep Dive

> <sub> _Sidenote:_ Installing course sample projects:
> `npm install --legacy-peer-deps` </sub>

## `Attribute Directives`

Only affect/changes the element (for example change a property).

## `Structural Directives`

Changes the DOM itself - elements get added/removed.
**Important**: we can't have more then one `Structural Directive` on the same element.

> <small> _Sidenote_: there can be used the normal class attribute **and** the [ngClass] attribute on the same element. WTF</small>

## Custom Directives

We can create a custom one with the `@Directive` decorator before the class. We pass an object to the decorator function, which has the following properties:

- `selector`: css rule to angular where to insert the directive (for example `[appBasicCustomDirective]` - this tells angular to apply the directive to every DOM element which has this attribute)

_We can get the DOM element with injection, as a constructor parameter, with the type of `ElementRef`._

> <small> _Sidenote_: **injection** is an angular feature where we tell angular what we need and it creates it automatically and gives it to us.</small>

**Example:**

```
@Directive({
  selector: '[appBasicHighlight]'
})
export class BasicHightlightDirective implements OnInit {
  constructor(private elementRef: ElementRef) {

  }

  ngOnInit(): void {
    this.elementRef.nativeElement.style.backgroundColor = 'green';
  }
}
```

_We also has to inform angular that we want to use a custom directive - we have to add to the `declarations` property of the `NgModule decorator`._

We can also create a directive with the following CLI command:

```
ng g d custom-directive-name
```

**There is a better way to alter the DOM and not access the element directly - `Renderer2`**

We can request the renderer in the constructor as a parameter with the `Renderer2` type, and angular will instantiates and provide it for us. We can use this to set the element style with the `setStyle` function.

_This is a better approach, as there are environments where you don't have access to the DOM. The Renderer has many features for DOM manipulations._

> <small>Ezt nem igazán értem, mert ehhez is kell az elementRef...</small>

**Example:**

```
@Directive({
  selector: '[appBetterHighlight]'
})
export class BetterHighlightDirective implements OnInit {

  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.renderer.setStyle(this.elRef.nativeElement, 'background-color', 'blue');
  }
}
```

## @HostListener

HostListener Decorator can be used to react to an event in a Directive (only in directive??). The event is specified as an argument to the decorator. It can even listen to custom events.

```
  @HostListener('mouseenter') mouseover(eventData: Event) {
    // code
  }
```

**Placing the listener on the document:**

```
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }
```

> <small>Ezt nem magyarázta el sajnos, egy szöveges részen volt...</small>

## @HostBinding

A better approach to change something on event. We need to bind this decorator to a class property. As the decorator argunemt, we define the DOM property we want to bind to the directive's property. It can also be used with the HostListener:

```
  @HostBinding('style.backgroundColor') backgroundColor: string = 'transparent';

  @HostListener('mouseenter') mouseover(eventData: Event) {
    this.backgroundColor = 'blue';
  }

  @HostListener('mouseleave') mouseleave(eventData: Event) {
    this.backgroundColor = 'transparent';
  }
```

**Trick with HostBinding:** You can bind a specific class name to a boolean property.

```
  @HostBinding('class.open') isOpen: boolean = false;
```

## Custom property binding

You can also use Input property in a directive (event binding also works). The Input properties can also have a default value. The properties in square brackets are on the same element that the directive is on.

```
<p appOurOwnDirective [propertyOfOurDirective]="'value_for_property'"></p>
```

> <small>_Sidenote:_ If you set another property with an Input, right at the declaration, then it will not get the correct value. You have to set it in the ngOnInit hook, to get the correct Input value.</small>

> <small>_Sidenote2:_ When you are using a property binding for a directive which is on a normal DOM element, angular first checks the directive class if it has the corresponding Input property. If not, then it checks the DOM element.</small>

**A nice trick:** If the directive has one _"main"_ property which be set with the directive's "attribute selector" itself, then give the directive's name to the property's Input decorator function (as an alias). But in that case you have to use the square brackets around the directive's attribute. Like this:

```
  // ...in the directive ts file
  @Directive({ selector: '[appOurOwnDirective]'})
  export class OurOwnDirective {
    @Imput('appOurOwnDirective') mainColor: string = 'black';
  }

  // ...in the parent components's template file
  <p [appOurOwnDirective]="'royalblue'"></p>
```

**Another trick, for property binding in general:** If a property accepts a single string, you can omit the square brackets and the single quoation marks:

```
  // these two lines are eqivalent, if that attribute only accepts a string
  <p appOurOwnDirective [propertyOfOurDirective]="'value_for_property'"></p>
  <p appOurOwnDirective propertyOfOurDirective="value_for_property"></p>
```

### Setter for an Input

A setter function can be defined for an Input property, which runs every time the property changes. The syntax is this:

```
@Input() set inputProp(value: typeOfTheProp) {
  // code runs
}
```

## What does '\*' means in structural directives?

The '*' before the structural directives means that the angular **will** transform the structure into something else. For example `*ngIf`means that the whole content will be wrapped with`<ng-template></ng-template>`, and the `[ngIf]` will get the condition as a property. Example

```
  // this will be transformed
  <p *ngIf="condition"> ... </p>

  // into this:
  <ng-template [ngIf]="condition"><p> ... </p></ng-template>

```

## Creating a custom structural directive

You can get the TemplateRef and the ViewContainerRef by injection, in the constructor.

- **TemplateRef:** ref to the <ng-template>...</ng-template> element, which is generated (see before)
- **ViewContainerRef:** ref the "parent" element in the DOM (<small>Itt nem értem pontosan, pl mi van ha a parent az egy custom component?</small>)

Code:

```
  constructor(private templateRef: TemplateRef<any>, private vcRef: ViewContainerRef) { }
```

## \*ngSwitch built-in directive

The syntax is very simple:

```
  <div [ngSwitch]="propName">
    <p *ngSwitchCase="5">Value is 5</p>
    <p *ngSwitchCase="10">Value is 10</p>
    <p *ngSwitchCase="100">Value is 100</p>
    <p *ngSwitchDefault>Value is Default</p>
  </div>
```

## Component vs Directive

- **Components** are used for creating a reusable element, with a custom behaviour. **Plus it creates it's own view!**
- **Directives** are only for adding/modifying a built-in DOM element or a component behaviour. **Plus it doesn't have it's own view.**

---
