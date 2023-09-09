# Standalone Components

**The problem `standalone components` solve:** there is much of a boilerplate code of importing and defining modules here and there.

> <small>Sidenote: there are `"Standalone"` `Directives` and `Pipes` as well</small>

The `Standalone Components` can be mixed with the modular way.

## How to do it?

Add the `standalone` property to the `@Component` decorator with `true` as value (`false` is the default).

```
  @Component({
    standalone: true,
    ...
  })
```

Now, we should not declare in any `NgModules`.

Now this `component` can be used anywhere, with one caveat: we have to let Angular know about the `component`.
We have to `import` this `Standalone Component` in the component we want to use it. But we can import it only in another `Standalone Component`.

```
  @Component({
    imports: [
      DetailsComponent
    ],
    ...
  })
```

Another solution: add it back to `@NgModule` decorator, but to the `imports` array.

> <small> **Sidenote:** with that, we still have more code then without `Standalone Components`. But we did not get rid of modules, **yet**.</small>

In the course, the `directive` that was imported in the `SharedModule`, was not working in the `Standalone Component` (`SC` from now). But it was working for me.** WTF?**

We imported `SharedModule` to the `SC`...

This migration process is something every **Angular** app will go through.

We can turn a `directive` or to a "standalone" with the same way as a `component`.

So if we want to use a `SC` or a `Standalone Pipe/Directive` - we have to import it in another "standalone" something **or** in a module.

> <small>Sidenote: when I tried to convert the `Welcome Component` to "standalone", it didn't display the `Details Component`. I had to change something in the `welcome.component.html` for it... very strange</small>

To migrate our "root component" to `SC`, we have to change the main.ts file: we have to _"bootstrap a `component`"_ not a `module`:

```
  // old way to bootstrap the application with a module:
  // platformBrowserDynamic().bootstrapModule(AppModule)
  //   .catch(err => console.error(err));

  // correct way to bootstrap an SC:
  bootstrapApplication(AppComponent);
```

So now we could remove `app.module.ts`.

The price is that we have to use the `standalone: true` property and imports everywhere.

## Services...

The default way to import `Services` to use the good old `providedIn: 'root'` property.

We can also `import` a `service` to a `component`. But in that way, only that component will have that instance.

We can also `provide a service` in the main.ts file. This is the equivalent of provide it in AppModule.

```
  bootstrapApplication(AppComponent, {
    providers: [
      AnalyticsService
    ]
  });
```

## Routing with `Standalone Components`

We have to `import` the `RouterModule` in the `@Component` decorator `imports` array.

```
  @Component({
    standalone: true,
    imports: [RouterModule],
    ...
  })
```

Then we have to our `AppRoutingModule` to the **`main.ts`** file (where we define the routes), with the `importProvidersFrom` helper function:

```
  bootstrapApplication(AppComponent, {
    providers: [
      // AnalyticsService,
      importProvidersFrom(AppRoutingModule)
    ],
  });
```

Now the lazy loading will also works.

## Use only `SCs` and `lazy load` them

In the routes definition, when defining a `route` for a `component`, which we want to `lazy load`:

```
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then((mod) => mod.AboutComponent),
  },
```

Here there are some magic stuff... so we can define routes in a separate file and then import these `routes` in a `loadChildren` method in the actual `Routing module`. WTF.

But I don't know how to do this without a custom `routing module`... maybe it is not possible.
