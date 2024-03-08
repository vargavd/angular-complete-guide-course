# NgRX

**NgRx:** an app-wide state management solution (a package). `State` is data that used throughout your application and which changes over time and that triggers some other changes, for example in the UI.

In that way - you don't have to store state in `services` or `components`.

> <small> Sidenote: This is an alternative to the good old `BehaviorSubject` in a `Service` method.</small>

## NgRX structure

**Store:** you must create a data store, that is where the state (data) is managed. The `components` react out to that `store` and listen to changes.
Plus Components can trigger data changes in the store with `dispatching actions` which trigger `reducers` inside the `store`. `Reducers` are the actual things that change the state.

**Selectors:** they are optionals, they can be used to get data from the Store.

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

The `Store` type must be generalized with a type that has the keys what we are using in there - it is only for that the TS compiler is not complaining.

> <small>Sidenote: It is a convention to add the `$` sign to the end of a property (or variable) name if it is an `Observable`.</small>

Then we can subscribe to that Observable, or just use the `async pipe` in the template.

So either in the `constructor`:

`this.count$.subscribe(newData => this.data = newData;)`

or just print in the `template` - this will be updated everytime the data changes in the store:

{{ count$ | async}}

### Change the data in store

You `dispatch actions` to initiate some change, you cannot modify the state directly. These `dispatched actions` are then handled by the reducers.

First, define the `actions` that can be `dispatched`, with the `createAction` method. Its first parameter is the string identifier of the action. It must be a **unique** amongst actions - so it is a convention to add the name of the feature this action belongs between brackets.

```
export const increment = createAction('[Counter Component] Increment');
```

Second, we define the handlers of these actions

#### Handle action in `createReducer`

If we created our reducer with `createReducer`: it gets the handlers in the second param with the `on` method:

```
  export const counterReducer = createReducer(
  initialState,
  on(increment, state => state + 1),
);
```

The `on` method's first parameter is the action we defined previously, the second parameter is the `handler func`. **This handle func is executed by `NgRX`.** This function gets the currernt state as a parameter and returns the updated state.

\*\*It is important not to change the state parameter directly - create a new one (for example with a spread operator for `objects`, or `slice` for `arrays`).

The returned data will be stored by `NgRX` as a new state.

### Dispatching an Action

You can `dispatch` an `action` with the `dispatch` functions of the NgRx store.
For the first parameter, you add the return value of the `action` function you created with the `createAction` function previously.

```
  // action creator definition
  export const increment = createAction('[Counter] Increment');

  // dispatching an event, possibly in another component
  this.store.dispatch(increment());
```

### Attach data to actions

To enable for the `action` to get property, you must use the second argument of the `createAction` function.

```
  export const increment = createAction(
  '[Counter] Increment',
  props<{ value: number }>()
);
```

You set the type as the `generic type` of this `proprs function`.

To get the property which the created `action` was given, you can use the second argument of the ` action handler`` function, in the  `reducer`:

```
  export const counterReducer = createReducer(
  initialState,
  on(increment, (state, action) => state + action.value)
);
```

The second `argument` here has a string `type` property, which is the name of the `action` (first param of the `createAction` func). The other keys of this object are the keys you defined as the `generic type` of `props` previously.

And then, when you dispatch the action, you must give a value of the exact type to the action creator:

```
  this.store.dispatch(decrement({ value: 1}));
```

### Alternative way of creating a reducer, without `createReducer`

This is the older syntax, which can be found in older projects.

```
  export function counterReducer(state = initialState, action: any) {
  if (action.type === '[Counter] Increment') {
    return state + action.value;
  }

  return state;
}
```

### Anternative way of create and action, without `createAction`

This is the older syntax, which can be found in older projects.

```
  // In this approach, we define the action property manually
  export class IncrementAction implements Action {
  readonly type = '[Counter] Increment';
  constructor(public value: number) {}
}
```

And then, when dispatching the action, you instantiate this action object, instead of calling an action creator:

`this.store.dispatch(new IncrementAction(1));`

**This alternative solutions were commented out in the code - if possible, use the newer approach as it is shorter and more clearer.**

## Selectors

Selectors are just functions and returns the desired value from the store. It gets the whole store as first param.

```
  // defining the selector
  export const selectCounter = (state: { counter: number }) => {
    return state.counter;
  }
```

To use the `selector`, we just give this to the `store.select` function as first parameter, instead of the key.

```
  // using the selector
  this.count$ = store.select(selectCounter);
```

_The advantage of this is only when you have a more complex selection logic._

You can have multiple selectors obviously.

You can also combine selectors or based one selector on another:

```
  export const selectDoubleCount = createSelector(
    selectCounter,
    (state) => state * 2
  )
```
