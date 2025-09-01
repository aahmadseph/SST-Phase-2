# Table of contents

-   [wrapComponent](#wrapcomponent)
    -   [Description](#description)
    -   [Syntax](#syntax)
    -   [Parameters](#parameters)
    -   [Return value](#return-value)
    -   [Exceptions](#exceptions)
    -   [Examples](#examples)
-   [wrapFunctionalComponent](#wrapfunctionalcomponent)
    -   [Description](#description-1)
    -   [Syntax](#syntax-1)
    -   [Parameters](#parameters-1)
    -   [Return value](#return-value-1)
    -   [Exceptions](#exceptions-1)
    -   [Examples](#examples-1)
-   [wrapHOC](#wraphoc)
    -   [Description](#description-2)
    -   [Syntax](#syntax-2)
    -   [Parameters](#parameters-2)
    -   [Return value](#return-value-2)
    -   [Exceptions](#exceptions-2)
    -   [Examples](#examples-2)
-   [wrapHOCComponent](#wraphoccomponent)
    -   [Description](#description-3)
    -   [Syntax](#syntax-3)
    -   [Parameters](#parameters-3)
    -   [Return value](#return-value-3)
    -   [Exceptions](#exceptions-3)
    -   [Examples](#examples-3)

# wrapComponent

## Description

Use this function to wrap class components created in `components` folder.

## Syntax

```js
wrapComponent(component, name, hasCtrlr);
```

## Parameters

`component`: `Component`

React component to wrap.

`name`: `String`

This argument will be used by framework and to set component's `displayName`.

`hasCtrlr`: `Boolean`

Should be `true` for components with lifecircle functions like `componentDidMount`. These components have file extension `*.ctrlr.jsx`. For components without lifecircle functions (components with `*.es6.jsx` file extension) this argument can be omitted otherwise set it value to `false`.

## Return value

Original component modified by framework.

## Exceptions

Does not throw exceptions by itself.

## Examples

> Example for \*.es6.jsx components

```js
module.exports = wrapComponent(ProductPageSEO, 'ProductPageSEO');
```

> Example for \*.ctrlr.jsx components

```js
module.exports = wrapComponent(RegularProduct, 'RegularProduct', true);
```

# wrapFunctionalComponent

## Description

Use this function to wrap functional components created in `components` folder.

## Syntax

```js
wrapFunctionalComponent(component, name);
```

## Parameters

`component`: `Component`

React component to wrap.

`name`: `String`

This argument will be used by framework and to set component's `displayName`.

## Return value

Original component modified by framework.

## Exceptions

Does not throw exceptions by itself.

## Examples

The following example demonstrates usage of `wrapFunctionalComponent` function.

> Example for \*.f.jsx components

```js
module.exports = wrapFunctionalComponent(Root, 'Root');
```

# wrapHOC

## Description

Generic HOC's wrapper for any HOC in application. Creates a new HOC by composing `withErrorBoundary`, `withUserHOC` (user provided HOC) and `withRenderTimeMeasurements` HOCs. `withRenderTimeMeasurements` HOC will not be used during SSR and non local or QA environmets.

## Syntax

```js
wrapHOC(withUserHOC);
```

## Parameters

`withUserHOC`: `Function`
User provided HOC.

## Return value

A new HOC based on composition of `withErrorBoundary`, `withUserHOC` and `withRenderTimeMeasurements` (optionaly) HOCs.

## Exceptions

`ArgumentNullException`

When `withUserHOC` function argument is `null` or `undefined`.

## Examples

The following example demonstrates usage of `wrapHOC` function.

```js
const withKillSwitch = wrapHOC(function withKillSwitch(WrappedComponent, killSwitchName) {
    const KillSwitch = props => {
        const killSwitchEnabled = Sephora.configurationSettings[killSwitchName] === true;

        return killSwitchEnabled ? <WrappedComponent {...props} /> : null;
    };

    return wrapHOCComponent(KillSwitch, 'KillSwitch', arguments);
});
```

# wrapHOCComponent

## Description

Sets component's displayName and additional attributes used by `withErrorBoundary` HOC and preserves component's creation context (HOC's function arguments).

## Syntax

```js
wrapHOCComponent(component, name, callContext);
```

## Parameters

`component`: `Component`

Component created within/by the HOC.

`name`: `String`

Component's name.

`callContext`: `Array`

Component creation context (HOC's function arguments).

## Return value

Returns the same component, that was passed as first function argument, modified by framework.

## Exceptions

`ArgumentNullException`

When `component` or `name` or `callContext` function argument is `null` or `undefined`.

`ArgumentOutOfRangeException`

When `callContext` is empty array. HOC's `WrappedComponent` should always be a as a first item in this array.

## Examples

The following examples demonstrate usage of `wrapHOCComponent` function.

> Example for the HOC created using ES5 syntax:

```js
wrapHOCComponent(KillSwitch, 'KillSwitch', arguments);
```

> Example for the HOC created using ES6 syntax (arrow function):

```js
wrapHOCComponent(KillSwitch, 'KillSwitch', [WrappedComponent]);
```
