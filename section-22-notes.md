# Section 22 Modules and Optimization

**`Modules`**: ways of _bundling_ (grouping) building blocks together.

Angular needs at least one module (`AppModule`).

> <small>_Sidenote: Exception: Standalone Components which is a newer feature_</small>

Core Angular features are also split between different modules.

In the `NgModule` directive, we can declare other modules in thethe `imports` array. In that way, we **import** the **exported** features from these modules.

The `providers` key array includes the services we want to use in the App (if we didn't define the `providedIn` syntax at the services).

The `bootstrap` array defines the components that are rendered on startup. But typically, we only have one root component.

Splitting your custom features into multiple modules can lead to leaner modules and more clearer and understandable application.

## Feature Modules

They are called `Feature Modules` - they group together components, services, directives and pipes which are belong to a certain feature.

Obviously, you must use the `NgModule` decorator for creating a separate module.

In this `decorator`, we must `export` all the components (and else) we are using elsewhere too.
And we must use `import` in the "target" module.

But in the exported module, you cannot use features available in the "target" module. For example: for being able to use Routing, you must import the `RoutingModule`.

> <small> **Sidenote:** `Services` work differently - they are available application wide. So if a `Module` only constists of `Services`, you don't need to import it in every `module`, only in the App Module.</small>

## CommonModule

There is another exception. You don't have to import `BrowserModule` everywhere, only in the `AppModule`. Import `CommonModule` instead in the other `modules`.

## Adding Routing to `FeatureModules`

We can also split our routing definitions between modules. In the `FeatureModule`, you can use the `forChild` method of the `RouterModule` which automatically merges the child routing configuration with the root routes.. (which are defined in the `AppModule` or a dedicated `AppRouting` module)

```
  imports: [
    RouterModule.forChild([
      { path: '...', component: ...},
      { path: '...', component: ..., canActivate: [...]},
      ...
    ])
  ]
```

> <small> Sidenote: if you are using the `components` only in their `Feature Module` and the routes are also definied here, you don't have to export them. </small>

## Shared Modules

This is also not a specific Angular feature. `Shared Module` is a regular module, but it contains some `components` or `directives` which are used in multiple `modules`.

Basically, in a `Shared Module` we export **everything** from the `declarations` and `imports` array.

**Important:** You can only define/declare `components`, `directives` and `pipes` _once_. So if a `module` declares something, it should not `import` another `module` which also declares the same thing!
_Exception_: you can import a module in different other modules.

## Core Module

This is also not an Angular feature - just a regular `module`.

It is a module that is used to make the `AppModule` a bit leaner. We just outsource some declarations or imports to it.
For example get all the `services` from a `Core Module` (if we don't use `providedIn: root` obviously...).
