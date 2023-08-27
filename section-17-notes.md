# Section 15 - Pipes: Transforming Output

**Pipes:** transforms some output in the templates.

> <small>A common pipe `uppercase`.</small>

Between the value you want to transform and the pipe, you must add a '|' sign.

```
  // somewhere in the template:
  {{ server.instanceType | uppercase }}
```

**`date`:** it is also a built-in pipe. It can control the format how to display a date.

## Adding parameters to pipes

You can add a parameter to pipe after a colon. To add another one - put another colon before. So something like this `pipeName : param1 : param1`.

> <small>The `date` pipe can handle a parameter (the "format")</small>

[_Built-in pipes_](https://angular.io/api?type=pipe)

## Chaining

_We can chain pipes after each other._ The order is important: the left pipe is applied first. For example, a date object should be first "piped" through the `date pipe` and **then** through the `uppercase`. The other way would throw an error.

## Create a `pipe`

Create a class which implements the `PipeTransform` interface - it does need a `transform` method. The first parameter is the `value` that needs to be transformed.

The class also needs the `Pipe` decorator. This decorator has one property: `name` - this will be the name which we can use this `pipe` in the template

_Plus, you need to add this Pipe class to the declarations array of a module._

```
  // in a html file
  {{ server.name | shorten }}

  // in shorten.pipe.ts file
  @Pipe({
      name: 'shorten'
  })
  export class ShortenPipe implements PipeTransform {
      transform(value: any) {
        // do some transformation
        return transformedValue;
      }
  }
```

Add a parameter to the pipe:

```
  // in the html file
  {{ server.name | shorten:5}}

  // in the ts file
  transform(value:any, limit:number) {
    ...
  }
```

_A pipe can have more parameters as well._

```
  // in the html file
  {{ server.name | shorten:5:'something'}}

  // in the ts file
  transform(value:any, limit:number. someOtherParam:string) {
    ...
  }
```

## Generate a `Pipe` with CLI:

`ng g p path-to-file/something-name`

## Transform a list

A `pipe` can be used to transform any value, not just a string or a date. The the `transform` method can accept _any_ type of value as the first parameter.

So if we built a pipe that filters/transforms an array of items, we could use it in a template:

```
<li
  ...
  *ngFor="let item of items | ourFilterPipe"
>
```

## Rerun the pipe on any data change

Add a `pure: false` property to the `@Pipe` decorator. This will recalculate the pipe if **anything** changes on the page. BUT:

> **Important note:**: _Rerun a filter pipe on every change could lead to a performance issue._

## Asnyc pipe

To display something that is being "resolved" in the future, run it through the `asnyc` pipe. It will detect if the variable has changed and will display it correctly (example in the **pipes-start** project, in `app.component.html`).
