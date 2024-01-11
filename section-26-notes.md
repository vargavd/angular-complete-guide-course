# NgRX

**NgRx:** an app-wide state management solution (a package). `State` is data that used throughout your application and which changes over time and that triggers some other changes, for example in the UI.

In that way - you don't have to store state in `services` or `components`.

> <small> Sidenote: This is an alternative to the good old `BehaviorSubject` in a `Service` method.</small>

## NgRX structure

**Store:** you must create a data store, that is where the state (data) is managed. The `components` react out to that `store` and listen to changes.
Plus Components can trigger data changes in the store with `dispatching actions` which trigger `reducers` inside the `store`. `Reducers` are the ones that actually change the state.

**Selectors:** they are optionals, they can be used to get a specific data from the Store.

There are also `Effects` they are triggered as "_sideeffects_" when any `action dispatches`.

---

### Installing

There is an Angular CLI command to add libraries to your projects. For example adding `NgRX`:
`ng add @ngrx/store`

This command will update the `app.module.ts` file, with some imports.

---

### `Reducer`

They are the ones that actually changes the data in the store.

The reducer in the end is just a function that gets some data and returns then the updated state.

It can be created with the `createReducer` method, from `@ngrx/store`. It gets one parameter: `initialState`. State can be any type (`number, boolean, object, array` etc...)

```
export const counterReducer = createReducer(0);
```

Then, in the `app.module.ts`, this reducer must be given the store in the imports array of the `NgModule` decorator:

```
  imports: [
    ...,
    StoreModule.forRoot({
      counter: counterReducer
    })
  ]
```

You can add multiple reducers - it will results multiple properties in the state.

### Alternative method to create a `reducer`

This will always work and `createReducer` does this under the hood.

You define the actual `reducer` function manually. It gets the current state as a parameter and returns the **modified** state. The param also must have an initial value. (The first time the `reducer` function being called, there won't be "current" state.)

```
  export function counterReducer(state = initialState) {
    // do some changes
    return newState;
  }
```

### Getting a value from store

You can inject the `store` into any component or service. Here the `store` is the one and only global store of the application.

Then you define an `observable` property and set the value to the actual value in the store with the select method (this gets the name ('key') of the correct `store property` as a param):

```
  import { Store } from '@ngrx/store';

  // ... in the component
  count$: Observable<number>;

  constructor(private store: Store<counter: number>) {
    this.count$ = store.select('counter');
  }
```

The `Store` type must be generalized with a type that has the keys what we are using in there - it is only important for the TS compiler.

> <small>Sidenote: It is a convention to add the `$` sign to the end of a property (or variable) name if it is an `Observable`.</small>

Then we can subscribe to that Observable, or just use the `async pipe` in the template.

So either in the `constructor`:

`this.count$.subscribe(newData => this.data = newData;)`

or just print in the `template` - this will be updated everytime the data changes in the store:

{{ count$ | async}}
