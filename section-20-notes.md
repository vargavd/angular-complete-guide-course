# Section 20 - Authentication

We are not using the old "session based" validation, like in the original websites.

Here, the Server will validate the credentials, and then the server will send a token to the client (an encoded string which contains a lot of meta data). This token is generated on the server and then later validates it in later requests.
This token is stored in local storage (for example) in the client.
This token is sent by the client to the server as a header or a query param. (???) - which validates it with its own private key.

---

## Sidenote

In firebase, we set up `auth != null` for read and write rules.

```
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

## Firebase Auth REST API

Google **Firebase Auth REST API** for checking the firebase API for authentication.

Here you find the URL that is needed to be called for authentication. Plus here are the "Common error codes" as well.

## BehaviorSubject

A different type of subject which we can use to "store" data as well - not just reactively `subscribe` to it. It works just like a `Subject`, but also gives immediate access to the prev value that was emitted previously.

It must have a start value.

If you want to load one value from a `BehaviorSubject` and then done with it, use the `take` operator from `rxjs`, with the following syntax:

```
  this.authService.user.pipe(take(1)).subscribe(user => {

    });
```

**Remember:** `take` also unsubscribe immediately once we got the value.
