# Section 21 Dynamic Components

They are `components` which are created during runtime. For example an alert or a modal with an overlay.

This is not specific feature of angular, we just use a component that is loaded on demand.

We display the component dynamically - programatically. There are ways to do it:

## ngIf

Put `ngIf` directive to the component selector, like this:

```
  <app-alert *ngIf="error">
    ...
  <app-alert>
```

## Dynamic Component Loader

It was used in older codebases. An example is in the course-project.
