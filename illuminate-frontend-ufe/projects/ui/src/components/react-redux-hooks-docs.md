# Hooks | React Redux

React Redux includes its own custom hook APIs, which allow your React components to subscribe to the Redux store and dispatch actions.

## Using Hooks in a React Redux App

### useSelector()

Allows you to extract data from the Redux store state for use in a component, using a selector function.

> **Info**: The selector function should be pure since it is potentially executed multiple times and at arbitrary points in time. See [Using Redux: Deriving Data with Selectors](https://redux.js.org/usage/deriving-data-selectors) in the Redux docs for more details on writing and using selector functions.

The selector will be called with the entire Redux store state as its only argument. The selector may return any value as a result, including directly returning a value that was nested inside state, or deriving new values. The return value of the selector will be used as the return value of the `useSelector()` hook.

The selector will be run whenever the function component renders (unless its reference hasn't changed since a previous render of the component so that a cached result can be returned by the hook without re-running the selector). `useSelector()` will also subscribe to the Redux store, and run your selector whenever an action is dispatched.

When an action is dispatched, `useSelector()` will do a reference comparison of the previous selector result value and the current result value. If they are different, the component will be forced to re-render. If they are the same, the component will not re-render. `useSelector()` uses strict `===` reference equality checks by default, not shallow equality.

The selector is approximately equivalent to the `mapStateToProps` argument to `connect` conceptually.

You may call `useSelector()` multiple times within a single function component. Each call to `useSelector()` creates an individual subscription to the Redux store. Because of the React update batching behavior used in React Redux v7, a dispatched action that causes multiple `useSelector()`s in the same component to return new values should only result in a single re-render.

> **Info**: There are potential edge cases with using props in selectors that may cause issues. See the Usage Warnings section of this page for further details.

### Equality Comparisons and Updates

When the function component renders, the provided selector function will be called and its result will be returned from the `useSelector()` hook. (A cached result may be returned by the hook without re-running the selector if it's the same function reference as on a previous render of the component.)

However, when an action is dispatched to the Redux store, `useSelector()` only forces a re-render if the selector result appears to be different than the last result. The default comparison is a strict `===` reference comparison. This is different than `connect()`, which uses shallow equality checks on the results of `mapState` calls to determine if re-rendering is needed. This has several implications on how you should use `useSelector()`.

With `mapState`, all individual fields were returned in a combined object. It didn't matter if the return object was a new reference or not - `connect()` just compared the individual fields. With `useSelector()`, returning a new object every time will always force a re-render by default. If you want to retrieve multiple values from the store, you can:

-   Call `useSelector()` multiple times, with each call returning a single field value.
-   Use Reselect or a similar library to create a memoized selector that returns multiple values in one object, but only returns a new object when one of the values has changed.
-   Use the `shallowEqual` function from React-Redux as the `equalityFn` argument to `useSelector()`, like:

```javascript
import { shallowEqual, useSelector } from 'react-redux';

// Pass it as the second argument directly
const selectedData = useSelector(selectorReturningObject, shallowEqual);

// or pass it as the `equalityFn` field in the options argument
const selectedData = useSelector(selectorReturningObject, {
    equalityFn: shallowEqual
});
```

### useSelector Examples

**Basic usage:**

```javascript
import React from 'react';
import { useSelector } from 'react-redux';

export const CounterComponent = () => {
    const counter = useSelector(state => state.counter);
    return <div>{counter}</div>;
};
```

**Using props via closure to determine what to extract:**

```javascript
import React from 'react';
import { useSelector } from 'react-redux';

export const TodoListItem = props => {
    const todo = useSelector(state => state.todos[props.id]);
    return <div>{todo.text}</div>;
};
```

### Using memoizing selectors

When using `useSelector` with an inline selector as shown above, a new instance of the selector is created whenever the component is rendered. This works as long as the selector does not maintain any state. However, memoizing selectors (e.g. created via `createSelector` from reselect) do have internal state, and therefore care must be taken when using them. Below you can find typical usage scenarios for memoizing selectors.

When the selector does only depend on the state, ensure that it is declared outside of the component so that the same selector instance is used for each render:

```javascript
import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

const selectNumCompletedTodos = createSelector(
    state => state.todos,
    todos => todos.filter(todo => todo.completed).length
);

export const CompletedTodosCounter = () => {
    const numCompletedTodos = useSelector(selectNumCompletedTodos);
    return <div>{numCompletedTodos}</div>;
};

export const App = () => {
    return (
        <>
            <span>Number of completed todos:</span>
            <CompletedTodosCounter />
        </>
    );
};
```

The same is true if the selector depends on the component's props, but will only ever be used in a single instance of a single component:

```javascript
import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

const selectCompletedTodosCount = createSelector(
    state => state.todos,
    (_, completed) => completed,
    (todos, completed) => todos.filter(todo => todo.completed === completed).length
);

export const CompletedTodosCount = ({ completed }) => {
    const matchingCount = useSelector(state => selectCompletedTodosCount(state, completed));
    return <div>{matchingCount}</div>;
};

export const App = () => {
    return (
        <>
            <span>Number of done todos:</span>
            <CompletedTodosCount completed={true} />
        </>
    );
};
```

However, when the selector is used in multiple component instances and depends on the component's props, you need to ensure that selector's memoization behavior is properly configured (see [here](https://reselect.js.org/faq/#can-i-share-a-selector-across-multiple-component-instances) for details).

### Development mode checks

`useSelector` runs some extra checks in development mode to watch for unexpected behavior. These checks do not run in production builds.

> **Info**: These checks were first added in v8.1.0

#### Selector result stability

In development, the provided selector function is run an extra time with the same parameter during the first call to `useSelector`, and warns in the console if the selector returns a different result (based on the `equalityFn` provided).

This is important, as a selector that returns a different result reference when called again with the same inputs will cause unnecessary rerenders.

```javascript
// this selector will return a new object reference whenever called,
// which causes the component to rerender after *every* action is dispatched
const { count, user } = useSelector(state => ({
    count: state.count,
    user: state.user
}));
```

If a selector result is suitably stable (or the selector is memoized), it will not return a different result and no warning will be logged.

#### Identity Function (state => state) Check

In development, a check is conducted on the result returned by the selector. It warns in the console if the result is the same as the parameter passed in, i.e. the root state.

A `useSelector` call returning the entire root state is almost always a mistake, as it means the component will rerender whenever anything in state changes. Selectors should be as granular as possible, like `state => state.some.nested.field`.

```javascript
// BAD: this selector returns the entire state, meaning that the component will rerender unnecessarily
const { count, user } = useSelector(state => state);

// GOOD: instead, select only the state you need, calling useSelector as many times as needed
const count = useSelector(state => state.count.value);
const user = useSelector(state => state.auth.currentUser);
```

### Comparisons with connect

There are some differences between the selectors passed to `useSelector()` and a `mapState` function:

-   The selector may return any value as a result, not just an object.
-   The selector normally should return just a single value, and not an object. If you do return an object or an array, be sure to use a memoized selector to avoid unnecessary re-renders.
-   The selector function does not receive an `ownProps` argument. However, props can be used through closure (see the examples above) or by using a curried selector.

### useDispatch()

```typescript
import type { Dispatch } from 'redux';
const dispatch: Dispatch = useDispatch();
```

This hook returns a reference to the dispatch function from the Redux store. You may use it to dispatch actions as needed.

**Examples**

```javascript
import React from 'react';
import { useDispatch } from 'react-redux';

export const CounterComponent = ({ value }) => {
    const dispatch = useDispatch();
    return (
        <div>
            <span>{value}</span>
            <button onClick={() => dispatch({ type: 'increment-counter' })}>Increment counter</button>
        </div>
    );
};
```

When passing a callback using dispatch to a child component, you may sometimes want to memoize it with `useCallback`. If the child component is trying to optimize render behavior using `React.memo()` or similar, this avoids unnecessary rendering of child components due to the changed callback reference.

```javascript
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const CounterComponent = ({ value }) => {
    const dispatch = useDispatch();
    const incrementCounter = useCallback(() => dispatch({ type: 'increment-counter' }), [dispatch]);
    return (
        <div>
            <span>{value}</span>
            <MyIncrementButton onIncrement={incrementCounter} />
        </div>
    );
};

export const MyIncrementButton = React.memo(({ onIncrement }) => <button onClick={onIncrement}>Increment counter</button>);
```

> **Info**: The dispatch function reference will be stable as long as the same store instance is being passed to the `<Provider>`. Normally, that store instance never changes in an application. However, the React hooks lint rules do not know that dispatch should be stable, and will warn that the dispatch variable should be added to dependency arrays for `useEffect` and `useCallback`. The simplest solution is to do just that:

```javascript
export const Todos = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchTodos());
        // Safe to add dispatch to the dependencies array
    }, [dispatch]);
};
```

### How to split out code when a file has become to big

You can split the reselect selectors into a seperate file. You can also split the component lifecycle functions into a seperate file. If there are large utlity functions those can be put in a seperate file as well. These supplementary files should always be kept in the same folder as the component using them unless they are shared across multiple components.

### Usage Warnings

(**Stale Props and "Zombie Children"**)[https://react-redux.js.org/api/hooks#stale-props-and-zombie-children]

### Hooks Recipes
