# Section 11 - Routing

Installing course sample projects:
`npm install --legacy-peer-deps`

**Routing in angular (or in any SPA):** with url change the browser actually stays on the same page, only javascript changes some (or most) parts on the page. Usually only the header or the sidebar remains the same.

## Defining routes (_'paths'_)

We can set up Routing with the following steps:

1. Defining a variable with type `Routes` (from `@angular/router`), import
2. Add `RouterModule` to the `imports` array in the `@NgModule` decorator, but in a special way. Add the `RouterModule.forRoot(appRoutes)` to the `imports` where appRoutes is the variable with the `Routes` type.
3. Render the currently _'selected'_ component with a special (element style) directive: `router-outlet`

### `Routes`

The `Routes` type is an array of objects, where the properties:

- `path:` the path after the host, without the beginning slash (for the home, it is just an empty string)
- `component:` which component should be loaded on a certain path

---

```
const appRoutes: Routes = [
  { path: 'users', component: Users }
];

...

@NgModule({
  ...
  imports: [ ..., RouterModule.forRoot(appRoutes), ...]
})

// in the html somewhere
<router-outlet><router-outlet>
```

## Creating "page links"

There is a special (attribute style) directive `routerLink`, which should be used on a link tag (`a`) in the same way as `href`. `routerLink` can be used as a "normal" attribute and give it a string, but also can be used in **property binding** where you can give it an array of the url segments.

```
<a routerLink="/">Home</a>
<a routerLink="/servers">Servers</a>
<a [routerLink]="['/users']">Users</a>
```

**Important:** here it matters if you add the beginning slash or not. With the beginning slash, it is an absolute path, without it it is a relative one to the current url. If you add a 'relative' path in your root component (`ĄppComponent`), it will always work the same way as an absolute, as it is added to only `/`.

You can also:

- add `./` to the beginning of your path: it is the same as a relative
- add `../` to navigate an upper route

### routerLinkActive

You can set the class of the active link with the `routerLinkActive` directive. It can be used on the wrapper element as well. There is a `routerLinkActiveOptions` directive which can be used to mark the element active only if it is exact match for the url.

_Howto:_

```
  <li routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
    <a routerLink="/">Home</a>
  </li>
```

## Go to route programatically

We can inject the angular `Router` and use it to trigger a route change. The `router.navigate` accepts an array of strings as the first parameter.

```
  // ...in some component
  constructor(private router: Router) {}

  // ...somewhere in the component
  this.router.navigate(['/users']); // <- go to the /users route

```

> **Important Sidenote:** the Router doens't know which route we are currently on, so if you want to give a relative link, you have to use the second parameter, which is an object with the `relativeTo` property. To this, you have to give the `ActivatedRoute`, which has to be injected earlier. <small>`relativeTo` property is set to `'/'` by default.</small> _Howto:_

```
  // ...in some component
  constructor(
    private router: Router,
    private route: ActivatedRoute) {}

  // ...somewhere in the component
  this.router.navigate(['user'], { relativeTo: this.route });
```

## Parameters in paths

The dynamic route segment of the path should start with `':'`. We can get this parameter from the `ActivatedRoute` injected parameter in the constructor: `route.snapshot.params['id']` - where the id is the 'name' of the segment when we defined our routes in the app module.

> <small>Sidenote: you can have multiple dynamic segments (parameters) in one route.</small>

### Getting route params reactively

It is important to "reload" the parameters if they change. For this, the `ActivatedRoute` offers a params property which is an **Observable** - you can subscribe to it and get the new parameters upon any change.

> <small>Sidenote: **Observable** is a big part of angular, more about it later.</small>

The Observable type has a `subscribe` method. The first parameter of this method is a function that fires if any new data is available.

> <small>Sidenote: If you get the url parameters from the `...snapshot` in the `ngOnInit` lifecycle hook, you only need to reget the parameters if it is possible to change the parameters without leaving the current `'Component'`.</small>

> <small>Sidenote2: it is best practise to unsubscribe on `ngOnDestroy` (example in the code), Athough it is not necessarry because angular does it for us. In case of custom Observables, you have to take care the unsubscription yourself.</small>

## Query parameters

### Creating a routerLink with query parameters

There is a bindable `queryParams` property of the `routerLink` directive, which gets a javascript object whose properties are the query parameters.
There is also the `fragment` property of `routerLink` which sets the fragment part (after #) of the link.
**Example:**

```
<a
  [routerLink]="['/servers', 5, 'edit']"
  [queryParams]="{allowEdit: 1}"
  fragment="loading"
>
  LinkToServer
</a>
```

### Navigate programatically with queryParams and fragment.

We can add `queryParams` and `fragment` to the `navigate` function of the `Route` angular service, as a second parameter.
There is also a third property of the second parameter: `queryParamsHandling` which can be either `merge` (default) or `preserve`.
Plus we can use here the `navigateTo` property as well, in the second param.

```
  this.router.navigate(
    ['/servers', id, 'edit'],
    { queryParams: { allowEdit: '21'}, fragment: 'aaaadsad', queryHandling}
  );
```

### Retrieve query params and fragment

Use `ActivatedRoute` again. We have two options again: the snapshot version of the values or the Observable one.

```
  // snapshot version (doesn't 'reload' if the params changes but the routing controller not)
  console.log(this.route.snapshot.queryParams);
  console.log(this.route.snapshot.fragment);

  // subscibe to any change
  this.route.queryParams.subscribe();
  this.route.fragment.subscribe();
```

## Nested Routes

To define nested routes, use the `children` property of the Route item. **Important:** you need to remove the part of the parent route from the child paths.
In order to display the components defined for the child routes, use the `router-outlet` directive again, in the "parent" component template

```
  // ...in app module
  const appRoutes: Routes = [
    { path: 'servers', component: ServersComponent, children: [
      { path: ':id', component: ServerComponent },
      { path: ':id/edit', component: EditServerComponent },
    ] },
  ];

  // ... in the ServersComponent template (so the component of the parent route)
  <router-outlet></router-outlet>
```

## Redirecting

To redirect a path to another, use the `redirectTo` property instead of the `component` in the path declaration˙:

```
  { path: 'to-be-redirected', redirectTo: '/something' }
```

## Wildcard Route

Double asterisks for the `path` property means to catch all routes. Make sure to use this rule last, or it would overwrite all your other paths.

```
  { path: '**', redirectTo: '/not-found' }
```

> **Important Sidenote:** angular matches path by prefix. It means that the empty path (`path: ''`) matches everything too! You can change the matching behaviour to 'full match' with the `pathMatch` property:

```
  // redirect only the root
  { path: '', redirectTo: '/home', pathMatch: 'full' } 
```

## Outsourcing routes to another module

We can outsource the routing definitions to an external module - this is a best practise if we have more than 2 or 3 routes because the app module can easily become crowded.
We define the routes there, and use the `exports` property of the `@NgModule` decorator to export the `RouterModule` to any other module which imports this module. Example in the **routing-start** project.

# Section 11 - Route Guards

**Route guards:** code that is executed once the route is loaded or is left. This can be used to check access rights.

To make a guard for a route, create a service that implements the `CanActivate` interface. It has a `canActivate` method which returns either a `boolean` or a `Promise<boolean>` - this will determine if the user can navigate to the corresponding route.

> <small>A guard **always** needs to be a service.</small>

**Example**

```

```

> <small>Sidenote: the canActivate method can return other things too but I didn't want to complicate this even more...</small>

> <small>Sidenote2: the routing-start project has a more complex example. In the `canActivate` it calls a custom service's function which returns a promise - that will emulate an async functionality with `setTimeout`. But in the end, it returns a `Promise<boolean>` which ultimately will determine if the user can navigate to the route or not.</small>

### Route Guards only for child

There is a `CanActivateChild` interface, where the `canActivateChild` function gets the same parameters as the `canActivate`. The class implements this interface needs to be added to the `canActivateChild` property in the route definition object.

```
  // ...
  {
    path: 'servers',
    canActivateChild: [AuthGuard],
    component: ServersComponent,
    children: [
      { path: ':id', component: ServerComponent },
      { path: ':id/edit', component: EditServerComponent },
    ]
  },
  // ...
```

### Guarding leaving a path

We need to create a custom intarface, which the corresponding route component implements and in the Guard, we check this interface. Example in the routing-start project, for the edit-server.

# Passing static data from route to component

There is a `data` property in the route definition object, which is passed down to the component. This data can be found in the ActivatedRoute service. Example for this in the `app-routing.module.ts` and the `error-page.component.ts`.

# Resolver: getting dynamic data based on route

`Resolver` is a `Guard` which "resolves" some data, before the route is rendered. It is verry similar to a "normal" guard, but it does not determine whether the route should be displayed or not - but it gets some data for the component that handles the corresponding route, (usually it gets/loads something based on a route parameter).

**Steps implementing such a resolver:**

1. Create a service that implements the `Resolve` interface, which is a generic type and gets the type as a parameter that will be 'loaded/resolved' for the route.
2. Implement the `resolve` method that will return an Observable, a Promise or directly the generic type param.
   _Here in that method, we get the ActivatedRouteSnapshot, which we can use to get the params._

```
  export class ServerResolver implements Resolve<Server> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
      Server | Observable<Server> | Promise<Server> {
      // return something of the return types
    }
  }
```

> <small>Sidenote: a service most likely will be needed to be injected into our service to get the data.</small>

3. Add this custom service to the correct route, with the `resolve` property. You add an object to the `resolve` property, which is key-value pairs. The key will be used in your component to get the loaded data, the value is your resolver service.

```
  { path: ':id', component: ServerComponent, resolve: {server: ServerResolver} },
```

4. In the route component, you get the loaded data from the ActivatedRoute service.

```
  export class ServerComponent implements OnInit {
    server: {id: number, name: string, status: string};

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
      .subscribe(
        (data: Data) => {
          this.server = data['server'] // <-- here the server string needs to be matched with the object property you add the custom resolver to, in the path definition.
        }
      );
  }
}
```

# Hash Routing

To enable `hash routing` (so to have a hash before the routes), you have to set `useHash` to true, in your module that defines the routes - it can be a separate module defined just for routing, or for simpler configurations, it can be your app module.

```
  @NgModule({
    imports: [
      RouterModule.forRoot(appRoutes, { useHash: true })
    ],
    exports: [
      RouterModule
    ]
  })
  export class AppRoutingModule {

  }
```
