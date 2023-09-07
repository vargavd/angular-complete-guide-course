# Section 13 - Observable

Installing course sample projects:
`npm install --legacy-peer-deps`

**Observable:** a data source, where the data is coming in a stream, with events. When a new data is available, a new event is omitted. This _observable pattern_ can be used getting data from https requests, DOM events etc...

You can use an observable with an **Observer**. This is the code that is subscribed to these events. It can handle:

- data
- errors
- completion event
  These are all asynchrounous tasks.

For example we can get an url parameter with subscribing to an **Observable** (`ActivatedRoute's param`):

```
  this.route.params.subscribe((params: Params) => {
    this.id = +params.id;
  });
```

> _<small>`Observables` are constructs to which you subscribe to be informed about changes of data.</small>_

> <small>`Observables` comes from package names `RxJs`.</small>

**You should unsubscribe from any `Observable` if you are not interested anymore to prevent memory leaks. For example do it in the ngOnDestroy lifecycle hook of a component (when the user navigates away). But: these are only applied to custom observables. Angular automatically unsubscribes us from its own built-in observable.**

> <small>A `Observable` returns a `subscription` - which can be used to unsubscribe later.</small>

To build a custom observable, we have to use RxJS:

```
  npm install --save rxjs@6 rxjs-compat
```

_How to create a custom observable and subscribe to it:_

```
  import { Observable } from 'rxjs';

  // ...
  const customObservable = Observable.create(observer => {
    // when a new data "arrives"
    observer.next(someData);

    // when an error occurs
    observer.error();

    // when the stream "is done"
    observer.complete();
  });

  // ...
  let mySubscription = customObservable.subscribe(data => {...}, error => {...}, () => {}); // 3rd parameter is the completion handler
```

> <small>When an Observable emits an error, it's done ("closes"), but will not call _complete_.</small>

## **Operators**

Transforms or filters the data coming from an Observable. We give operators into the `pipe` method of an `Observable`. We can add unlimited number of operators to the pipe method as arguments. This would create a chain of steps the data is going through.

```
  // imports operators from RxJS
  import { map, filter } from 'rxjs/operators';

  // ...
  myObservable.pipe(map(data => { some transformation }), filter(data => some boolean))
```

### **Map**

`Map` is one of the most used built-in operators (it can be imported from `rxjs/operators`). `Filter` is another from the same package.

## **Subject**

Subject is a special construct, similar to the Observable, which you can also subscribe to. The difference from an Observable is that you can call "next" from outsite on a Subject so it can be used like an event emitter. Subject is recommended over EventtEmitter.
Also **unsubscribe** from Subjects as well.

> <small>**Important:** The difference between `Subject` and `Observable` is that `Observable` is a more passive stream - it just generates or gets the data. `Subject` is more active - we can trigger the next data with it, similarly to `EventEmitter`.</small>

> <small>**Important2:** `Subjects` are more efficient then `EventEmitters`.</small>

### With `Output`

**If you are using it with @Ouput, then use EventEmitter.**
