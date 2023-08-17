# Section 9 - Services & Dependency Injection

Installing course sample projects:
`npm install --legacy-peer-deps`

**Dependency Injection:** this simply instantiates and injects into our component what we need, as an argument! The type of the argument needs to be what you want to inject. The type **part** the one that tells angular what we need. It works because the class you create, are also instantiated by angular - angular creates it, not you. You also need to add the class you want to get to the providers array property of the `@Component()` decorator (or `@NgModule()`).

## Services

A separate code, a business unit, which provide a functionality to the rest of you application. For example, codes that you would duplicate otherwise, or some central storage (**ez igaz? nem lesz erre vmi később??**). <br />
A service is just a normal TS class, there is no Service decorator. The important thing is that **you don't instantiate the class itself** manually, you use angular's dependency injector, in the constructor. Plus you add the Service class to the providers array property in the `@Component()` decorator (or `@NgModule()`).

```
  // in our own **.service.ts. file
  export class SimpleCustomService { ... }

  // in our component where we want to use SimpleCustomService

  import { SimpleCustomService } from '.../simple-custom-service.service.ts';

  @Component({ ..., providers: [SimpleCustomService]})
  export class OurComponent {
    constructor(private simpleCustomService: SimpleCustomService) {}

    // ... in some event handler
    simpleCustomService.doSomething();
  }
```

## Hierarchical Injector

Angular's `Dependency Injector` is a hierarchical one. It means that if a component gets a service with injection, then all of its descendant component will get the same instance - but not the siblings. So the instances are propagate down. So where to inject it?

- In `AppModule`: in that case the `Service's` instance will be Application-wide.
- In `AppComponent`: the same instance will be available in all Components, but **not in other services**

> <small>_Sidenote:_ if we inject a service in the `AppComponent`, but also in another component as well, this latter injection will override the instance for this component (??and branch??).</small>

So in order to not to overwrite a `Service` in a component and get the "inherited" one, simply don't add it to the `providers array`. But keep it in the constructor.

> <small>_Sidenote:_ We can inject Services into Services, but for that, we need to do two things: provide the Service in the app module, plus mark the target service with the `@Injectable` decorator - so the service we want to inject other service to.</small>

> <small>_Other sidenote:_ newer versions recommend to add the `@Injectable` decorator to all service.</small>

> <small>_Third sidenote:_ you can create an @Output event emitter in a service and use it to trigger an event from a component to another.</small>

There is another way to provide a service application-wide, in Angular6+. Set the `providedIn: 'root'` property in the `@Injectable ` decorator before the service. In that way you don't have to add it to the providers array in `@NgModule()`.

```
  @Injectable({providedIn: 'root'})
  export class MyService { ... }
```
