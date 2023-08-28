# Section 18 - HTTP communication

**Angular shouldn't connect directly to a database - as we should store credentials for that.**

**Solution:** We should communicate with server - with a REST or a GraphQL endpoints. And the server can handle the database (or anything else..).

## HTTP request

Parts:

- URL (API endpoint)
- HTTP Verb ("action"): `POST`, `GET`, `PUT`, ...
- Headers (metadata): these are optional as there are some defaults
- Body: a JSON object - this can be also optional (only with `POST`, `PUT` and `PATCH`)

## Firebase DB

_We can use **Firebase Realtime Database** easily with an Angular app._

- Start with Test more: this is without authentication (??)

You will get a default URL, something like this

`https://angular-tcg---http-section-default-rtdb.europe-west1.firebasedatabase.app/`

You can add a "folder" to that URL - this way you create that "database", but we need to add with a json extension:

`firebase-url...app/posts.json`

## Requirements

To be able to make HTTP requests, we must import `HTTPClientModule` in a module and then inject HTTPClient service to a component.

```
  // ... in a module ts file
  imports: [HttpClientModule],

  // ... in a component
  constructor(private http: HTTPClient) {}
```

## HTTPClient

It has many function (`get`, `post`, `put` etc...)

### POST

```
this.http.post('url', postData)
```

Where `postData` is a JS object - Angular automatically converts it to JSON.

But to send the request, we need to subscribe to that POST request (the request call returns an `Observable`):

```
this.http.post('url', postData).subscribe(responseData => {})
```

The `subscribe` call gets a function which parameter is the **responseData**.

> <small> _Sidenote:_ this is `Observable` of Angular, therefor you don't need to unsubscribe (but it is a good practise imho). </small>

> <small> _Sidenote:_ the post call will complete itself immediately anyway. </small>

> <small>_Sidenote:_ the browsers always send 2 requests when making a `POST` - the first one's method is `OPTIONS`, which is for finding out the POST one is allowed or not. </small>

## GET

There isn't a second param for the `get` method. We also need to `subscribe` to send a `GET request`.

```
  this.http.get('...url').subscribe(posts => console.log(posts));
```

## Transforming the data

To transform the data we get from a request, we can add operators with `pipe` method to funnel your data - for example with the `map` operator.

```
  this.http.get('...')
    .pipe(map(responseData => {
      // ... return transformed data
    }))
    .subscribe(...)
```

### Adding a type

We can add a type to the `map` operator (or anywhere)

`map((responseData: {[key:string]: { title: string, content: string }}) => {`

TS will even know the type in the subscribe method as well.

### Using the generic parameter for the type

But a better way to add type, to add it to the `get` method as a generic type.

`this.http.get<{ something...}>('...url').pipe(...).subscribe(...)`

This generic type is available for all requests method of the `HttpClient`.

> <small>Sidenote: It is a nice practise to outsource HTTP requests in a service. </small>

## Error handling in HTTP

The `subscribe` function's second parameter is the error handler one.

### Using `Subject` in error handling

Create a `Subject` in the HTTP handling Service, and call `next` on that `Subject` when an error occurs.
Then subscribe to that `Subject` in the components that are interested in that error (plus don't forget to **unsubscribe**).

### `catchError` operator

We can add an operator to the `pipe` method as a second parameter - use here the `catchError` operator. Here we can do some generic error handling - for example log it to some analytics. Then we can pass on the error to the subscribe with the `throwError` function - we must return it:

```
  this.http.get<...>(...)
    .pipe(
      postHandlingFunc,
      catchError(errorRes => {
        // ... general error handling
        return throwError(errorRes);
      }));
```

## Configure HTTP requests

Any HTTP request method has an additional argument where you can set up some configuration - this is an object.

### Add custom headers

One of the properties of this object is the `headers`, which is a `HttpHeaders` object. Call `HttpHeaders` with new and give an object of headers as an argument to the constructor. This object parameter is just a collection of key-value pairs of custom headers.

```
  this.http.get<..>(
    '...url',
    {
      headers: new HttpHeaders({
        'Custom-Header': 'Hello'
      })
    }
  ).pipe(...);
```

### Adding query params

`params` is another key of that configuration object, with the type `HttpParams`. Again, you have to create an instance of the object, but the syntax a little bit different with the `set` method:

```
  this.http.get<..>(
    '...url',
    {
      headers: ...,
      params: new HttpParams().set('key', 'value')
    }
  ).pipe(...);
```

You can create the HttpParam variable separately, before the request, with another special syntax:

```
let searchParams = new HttpParams();
searchParams = searchParams.append('print', 'pretty');
searchParams = searchParams.append('custom_key', 'valuee');
```

### Getting the full (HTTP) Response data

In the same config object, there can be a key `observe`. The value can be either `body`, `response`, `events`.

With `response`, you can get the status and the headers too.

**_Sidenote:_ With `tap` operator, you can "pipe" the response data without altering it!**

With `observe: 'events'`, you can get the event type. The `HttpEventType` enum can be used to check what event has been occured.

```
this.http.delete(...)
  .pipe(tap(event => {
    if (event.type === HttpEventType.Sent) {
        // ...
      }
  }));
```

For example - if you are uploading a file, there is a code for that in the `HttpEventType` enum.

### `responseType`

It is also a config property in the object. The default value is 'json', but you can set it to 'text' or 'blob' (in case of file).

**THIS responseType WASN'T WORKING RIGHT NOW (2023.08.29) - I have no idea why :/ - maybe it was because of the generic type...**

## Interceptors

We can set the http configuration for application wide - for all requests at once with **Interceptors**.

For example with an Authentication header.

The Interceptor runs some code before the request is "sent".

`Interceptor` is a service that implements `HttpInterceptor` interface. It means it will have an `intercept` method, which has two parameters: an HttpRequest<> and a HttpHandler type.

The first param is the request itself, it is a generic type.

This function must return a special call: `return next.handle(req);`, otherwise the request will not leave the app.

```
  export class AuthInterceptorService implements HttpInterceptor  {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Request is on its way');
    return next.handle(req);
  }
}
```

In order to make the Interceptors work, the module must be configured properly (with a very special syntax). This is the syntax we inject the interceptor...

```
  @NgModule({
    ...
    providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }]
  })
```

### Modify the request object inside an `Interceptor`

The `HttpRequest` parameter is immutable - cannot be modified. So you have make a clone. For example add an 'Auth' header for every request:

```
const modifiedRequest = req.clone({headers: req.headers.append('Auth', 'xyz')});
return next.handle(modifiedRequest);
```

> <small>**Sidenote:** this will add a new header, not replace the original headers</small>

Then you must return the new request object.

### You can also use an Interceptor on the response

`next.handle` returns an `Observable` - you can add pipe it and use `tap` for example. Or map and transform it...

### Multiple Inteptor

It is possible to add multiple interceptors to the module. The order is very important - that wil be the excecution order.

Example in the app....

> <small> **Sidenote:** (this section is insane long and full with information...) </small>
