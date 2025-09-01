# Hooks

Hooks let you use state and other React features without writing a class. Hooks are backwards-compatible.

### State Hook

This example renders a counter. When you click the button, it increments the value:

```javascript
import React, { useState } from 'react';

function Example() {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
    );
}
```

Here, `useState` is a Hook. We call it inside a function component to add some local state to it. React will preserve this state between re-renders. `useState` returns a pair: the current state value and a function that lets you update it. You can call this function from an event handler or somewhere else. It’s similar to `this.setState` in a class, except it doesn’t merge the old and new state together.

The only argument to `useState` is the initial state. In the example above, it is 0 because our counter starts from zero. Note that unlike `this.state`, the state here doesn’t have to be an object — although it can be if you want. The initial state argument is only used during the first render.

#### Declaring multiple state variables

You can use the State Hook more than once in a single component:

```javascript
function ExampleWithManyStates() {
    // Declare multiple state variables!
    const [age, setAge] = useState(42);
    const [fruit, setFruit] = useState('banana');
    const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
    // ...
}
```

The array destructuring syntax lets us give different names to the state variables we declared by calling `useState`. These names aren’t a part of the `useState` API. Instead, React assumes that if you call `useState` many times, you do it in the same order during every render.

### Effect Hook

You’ve likely performed data fetching, subscriptions, or manually changing the DOM from React components before. We call these operations “side effects” (or “effects” for short) because they can affect other components and can’t be done during rendering.

The Effect Hook, `useEffect`, adds the ability to perform side effects from a function component. It serves the same purpose as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` in React classes, but unified into a single API.

For example, this component sets the document title after React updates the DOM:

```javascript
import React, { useState, useEffect } from 'react';

function Example() {
    const [count, setCount] = useState(0);

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // Update the document title using the browser API
        document.title = `You clicked ${count} times`;
    });

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
    );
}
```

When you call `useEffect`, you’re telling React to run your “effect” function after flushing changes to the DOM. Effects are declared inside the component so they have access to its props and state. By default, React runs the effects after every render — including the first render.

Effects may also optionally specify how to “clean up” after them by returning a function. For example, this component uses an effect to subscribe to a friend’s online status, and cleans up by unsubscribing from it:

```javascript
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
    const [isOnline, setIsOnline] = useState(null);

    function handleStatusChange(status) {
        setIsOnline(status.isOnline);
    }

    useEffect(() => {
        ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
        return () => {
            ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
        };
    });

    if (isOnline === null) {
        return 'Loading...';
    }
    return isOnline ? 'Online' : 'Offline';
}
```

In this example, React would unsubscribe from our `ChatAPI` when the component unmounts, as well as before re-running the effect due to a subsequent render.

### Rules of Hooks

Hooks are JavaScript functions, but they impose two additional rules:

1. Only call Hooks at the top level. Don’t call Hooks inside loops, conditions, or nested functions.
2. Only call Hooks from React function components. Don’t call Hooks from regular JavaScript functions.

### Building Your Own Hooks

Sometimes, we want to reuse some stateful logic between components. Traditionally, there were two popular solutions to this problem: higher-order components and render props. Custom Hooks let you do this, but without adding more components to your tree.

First, we’ll extract this logic into a custom Hook called `useFriendStatus`:

```javascript
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
    const [isOnline, setIsOnline] = useState(null);

    function handleStatusChange(status) {
        setIsOnline(status.isOnline);
    }

    useEffect(() => {
        ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
        return () => {
            ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
        };
    });

    return isOnline;
}
```

Now we can use it from both components:

```javascript
function FriendStatus(props) {
    const isOnline = useFriendStatus(props.friend.id);
    if (isOnline === null) {
        return 'Loading...';
    }
    return isOnline ? 'Online' : 'Offline';
}

function FriendListItem(props) {
    const isOnline = useFriendStatus(props.friend.id);
    return <li style={{ color: isOnline ? 'green' : 'black' }}>{props.friend.name}</li>;
}
```

The state of each component is completely independent. Hooks are a way to reuse stateful logic, not state itself. In fact, each call to a Hook has a completely isolated state — so you can even use the same custom Hook twice in one component.

# useCallback

`useCallback` is a React Hook that lets you cache a function definition between re-renders.

```jsx
const cachedFn = useCallback(fn, dependencies);
```

## Reference

`useCallback(fn, dependencies)`

Call `useCallback` at the top level of your component to cache a function definition between re-renders:

```jsx

import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {

  const handleSubmit = useCallback((orderDetails) => {

    post('/product/' + productId + '/buy', {

      referrer,

      orderDetails,

    });

  }, [productId, referrer]);

  // ...

```

See more examples below.

## Parameters

-   **fn**: The function value that you want to cache. It can take any arguments and return any values. React will return (not call!) your function back to you during the initial render. On next renders, React will give you the same function again if the dependencies have not changed since the last render. Otherwise, it will give you the function that you have passed during the current render, and store it in case it can be reused later. React will not call your function. The function is returned to you so you can decide when and whether to call it.

-   **dependencies**: The list of all reactive values referenced inside of the `fn` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is configured for React, it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the `Object.is` comparison algorithm.

## Returns

On the initial render, `useCallback` returns the `fn` function you have passed.

During subsequent renders, it will either return an already stored `fn` function from the last render (if the dependencies haven’t changed), or return the `fn` function you have passed during this render.

## Caveats

-   `useCallback` is a Hook, so you can only call it at the top level of your component or your own Hooks. You can’t call it inside loops or conditions. If you need that, extract a new component and move the state into it.

## Usage

### Skipping re-rendering of components

When you optimize rendering performance, you will sometimes need to cache the functions that you pass to child components. Let’s first look at the syntax for how to do this, and then see in which cases it’s useful.

To cache a function between re-renders of your component, wrap its definition into the `useCallback` Hook:

```jsx

import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {

  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  // ...

```

You need to pass two things to `useCallback`:

1. A function definition that you want to cache between re-renders.

2. A list of dependencies including every value within your component that’s used inside your function.

On the initial render, the returned function you’ll get from `useCallback` will be the function you passed.

On the following renders, React will compare the dependencies with the dependencies you passed during the previous render. If none of the dependencies have changed (compared with `Object.is`), `useCallback` will return the same function as before. Otherwise, `useCallback` will return the function you passed on this render.

In other words, `useCallback` caches a function between re-renders until its dependencies change.

Let’s walk through an example to see when this is useful.

Say you’re passing a `handleSubmit` function down from the `ProductPage` to the `ShippingForm` component:

```jsx

function ProductPage({ productId, referrer, theme }) {

  return (
    <div className={theme}>
    <ShippingForm onSubmit={handleSubmit} />
    </div>
  );

  // ...

```

You’ve noticed that toggling the `theme` prop freezes the app for a moment, but if you remove `<ShippingForm />` from your JSX, it feels fast. This tells you that it’s worth trying to optimize the `ShippingForm` component.

By default, when a component re-renders, React re-renders all of its children recursively. This is why, when `ProductPage` re-renders with a different theme, the `ShippingForm` component also re-renders. This is fine for components that don’t require much calculation to re-render. But if you verified a re-render is slow, you can tell `ShippingForm` to skip re-rendering when its props are the same as on last render by wrapping it in `memo`:

You don't need to explicitly use memo when working with components in UFE. That is handled automatically by the `wrapFunctionalComponent()` function.

```jsx
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
    // ...
});
```

With this change, `ShippingForm` will skip re-rendering if all of its props are the same as on the last render. This is when caching a function becomes important! Let’s say you defined `handleSubmit` without `useCallback`:

```jsx
function ProductPage({ productId, referrer, theme }) {
    // Every time the theme changes, this will be a different function...

    function handleSubmit(orderDetails) {
        post('/product/' + productId + '/buy', {
            referrer,

            orderDetails
        });
    }

    return (
        <div className={theme}>
            {/* ... so ShippingForm's props will never be the same, and it will re-render every time */}
            <ShippingForm onSubmit={handleSubmit} />
        </div>
    );
}
```

In JavaScript, a function `() {}` or `() => {}` always creates a different function, similar to how the `{}` object literal always creates a new object. Normally, this wouldn’t be a problem, but it means that `ShippingForm` props will never be the same, and your `memo` optimization won’t work. This is where `useCallback` comes in handy:

```jsx
function ProductPage({ productId, referrer, theme }) {
    // Tell React to cache your function between re-renders...

    const handleSubmit = useCallback(
        orderDetails => {
            post('/product/' + productId + '/buy', {
                referrer,
                orderDetails
            });
        },
        [productId, referrer]
    ); // ...so as long as these dependencies don't change...

    return (
        <div className={theme}>
            {/* ...ShippingForm will receive the same props and can skip re-rendering */}
            <ShippingForm onSubmit={handleSubmit} />
        </div>
    );
}
```

By wrapping `handleSubmit` in `useCallback`, you ensure that it’s the same function between the re-renders (until dependencies change). You don’t have to wrap a function in `useCallback` unless you do it for some specific reason. In this example, the reason is that you pass it to a component wrapped in `memo`, and this lets it skip re-rendering. There are other reasons you might need `useCallback` which are described further on this page.

## Note

You should only rely on `useCallback` as a performance optimization. If your code doesn’t work without it, find the underlying problem and fix it first. Then you may add `useCallback` back.

# useMemo

`useMemo` is a React Hook that lets you cache the result of a calculation between re-renders.

```jsx
const cachedValue = useMemo(calculateValue, dependencies);
```

## Reference

`useMemo(calculateValue, dependencies)`

Call `useMemo` at the top level of your component to cache a calculation between re-renders:

```jsx
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
    const visibleTodos = useMemo(
        () => filterTodos(todos, tab),

        [todos, tab]
    );

    // ...
}
```

See more examples below.

## Parameters

-   **calculateValue**: The function calculating the value that you want to cache. It should be pure, take no arguments, and return a value of any type. React will call your function during the initial render. On next renders, React will return the same value again if the dependencies have not changed since the last render. Otherwise, it will call `calculateValue`, return its result, and store it so it can be reused later.

-   **dependencies**: The list of all reactive values referenced inside of the `calculateValue` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the `Object.is` comparison.

## Returns

On the initial render, `useMemo` returns the result of calling `calculateValue` with no arguments.

During next renders, it will either return an already stored value from the last render (if the dependencies haven’t changed), or call `calculateValue` again, and return the result that `calculateValue` has returned.

## Caveats

-   `useMemo` is a Hook, so you can only call it at the top level of your component or your own Hooks. You can’t call it inside loops or conditions. If you need that, extract a new component and move the state into it.

-   In Strict Mode, React will call your calculation function twice in order to help you find accidental impurities. This is development-only behavior and does not affect production. If your calculation function is pure (as it should be), this should not affect your logic.

## Usage

### Skipping expensive recalculations

To cache a calculation between re-renders, wrap it in a `useMemo` call at the top level of your component:

```jsx
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
    const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);

    // ...
}
```

You need to pass two things to `useMemo`:

1. A calculation function that takes no arguments, like `() =>`, and returns what you wanted to calculate.

2. A list of dependencies including every value within your component that’s used inside your calculation.

On the initial render, the value you’ll get from `useMemo` will be the result of calling your calculation.

On every subsequent render, React will compare the dependencies with the dependencies you passed during the last render. If none of the dependencies have changed (compared with `Object.is`), `useMemo` will return the value you already calculated before. Otherwise, React will re-run your calculation and return the new value.

In other words, `useMemo` caches a calculation result between re-renders until its dependencies change.

Let’s walk through an example to see when this is useful.

By default, React will re-run the entire body of your component every time that it re-renders. For example, if this `TodoList` updates its state or receives new props from its parent, the `filterTodos` function will re-run:

```jsx
function TodoList({ todos, tab, theme }) {
    const visibleTodos = filterTodos(todos, tab);

    // ...
}
```

Usually, this isn’t a problem because most calculations are very fast. However, if you’re filtering or transforming a large array, or doing some expensive computation, you might want to skip doing it again if data hasn’t changed. If both `todos` and `tab` are the same as they were during the last render, wrapping the calculation in `useMemo` like earlier lets you reuse `visibleTodos` you’ve already calculated before.

This type of caching is called memoization.

## Note

You should only rely on `useMemo` as a performance optimization. If your code doesn’t work without it, find the underlying problem and fix it first. Then you may add `useMemo` to improve performance.
