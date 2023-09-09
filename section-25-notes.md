# Signals

`Signals` were intruduced at **Angular** _v16_ - it is a preview yet, _v17_ will have the finalized version, most likely.

`Signals`: a new way to detect data changes.

**_Until now:_** it was the _classic change detection_ or with other name _zone based change detection_. It means data is changed with simply changing values of properties. With tzhis, the changes are detected automatically. It is thanks for a library called **`ZoneJS`**. It is "scans" the functions and analyze them what properties changes. This is the classic change detection algorythm.

The problems with that solution are **performance** _and_ **bundle size**.

With `Signals` there are no automatic change detection - we tell when the data changes. We have full control and a more performant app. But to have these benefits, **no part** of the application should use the old approach, otherwise `ZoneJS` will be included in the bundle.
Also in v16, we cannot fully switch to **Signals** yet (lol).
