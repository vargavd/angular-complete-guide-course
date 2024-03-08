import { createSelector } from "@ngrx/store";

export const selectCounter = (state: { counter: number }) => {
  return state.counter;
}

export const selectDoubleCount = createSelector(
  selectCounter,
  (state) => state * 2
)