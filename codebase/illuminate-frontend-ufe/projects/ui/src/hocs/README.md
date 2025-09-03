# Table of contents for the `hocs` folder

-   [Overview](#overview)
-   [Code convention](#code-convention)
-   [Examples](#examples)
    -   [HOC with functional component](#hoc-with-functional-component)
        -   [HOC with extra arguments](#hoc-with-extra-arguments)
        -   [Same HOC but using ES6 syntax](#same-hoc-but-using-es6-syntax)
        -   [HOC without extra arguments using ES6 syntax](#hoc-without-extra-arguments-using-es6-syntax)
    -   [HOC with class component](#hoc-with-class-component)
        -   [With extra arguments](#with-extra-arguments)
        -   [Using ES6 syntax](#using-es6-syntax)
        -   [Without extra arguments using ES6 syntax](#without-extra-arguments-using-es6-syntax)
-   [Composing HOCs](#composing-hocs)

# Overview

The `hoc` folder contains all generic HOCs used in application.

# Code convention

In addition to [base rules defined here](../../../README.md) we have couple more specific for files in `actions` folder.

-   Any HOC in `hocs` folder must have a prefix `with`.
-   A HOC should export itself via object (named export) syntax only.
-   Every HOC has to be wrapped with [wrapHOC](../utils/framework/README.md#wraphoc) function.
-   Component returned by HOC has to be wrapped with [withHOCComponent](../utils/framework/README.md#wraphoccomponent) function.
-   Do not set `displayName` for the component returned by HOC.
-   If HOC is used just once, and you do not anticipate it's being reused in the future - put it to the `viewModel` folder.

# HOC Examples

**`EVERY`** HOC in application has to be wrapped with `wrapHOC` function.

There is no difference in a way how we wrap functional or class HOCs.

See examples below of wrapping different HOC types (with or without extra arguments and ES6 syntax).

## HOC with functional component

### HOC with extra arguments

> Preferable implementation!

```js
const { wrapHOC, wrapHOCComponent } = require('utils/framework').default;
const React = require('react');

const withKillSwitch = wrapHOC(function withKillSwitch(WrappedComponent, killSwitchName) {
    const KillSwitch = props => {
        const killSwitchEnabled = Sephora.configurationSettings[killSwitchName] === true;

        return killSwitchEnabled ? <WrappedComponent {...props} /> : null;
    };

    // Special object `arguments` is used here.
    return wrapHOCComponent(KillSwitch, 'KillSwitch', arguments);
});

module.exports = { withKillSwitch };
```

### Same HOC but using ES6 syntax

```js
const { wrapHOC, wrapHOCComponent } = require('utils/framework').default;
const React = require('react');


const withKillSwitch = (WrappedComponent, killSwitchName) => {
    const KillSwitch = props => {
        const killSwitchEnabled = Sephora.configurationSettings[killSwitchName] === true;

        return killSwitchEnabled ? <WrappedComponent {...props} /> : null;
    };

    // Third argument has to be always of type Array and contain all HOC function arguments.
    return wrapHOCComponent(KillSwitch, 'KillSwitch', [WrappedComponent, killSwitchName]);
});

module.exports = { withKillSwitch };
```

### HOC without extra arguments using ES6 syntax

```js
const { wrapHOC, wrapHOCComponent } = require('utils/framework').default;
const React = require('react');

const withKillSwitch = wrapHOC(WrappedComponent => {
    const KillSwitch = props => {
        const killSwitchEnabled = Sephora.configurationSettings[killSwitchName] === true;

        return killSwitchEnabled ? <WrappedComponent {...props} /> : null;
    };

    // Third argument has to be always of type Array and contain all HOC function arguments.
    return wrapHOCComponent(KillSwitch, 'KillSwitch', [WrappedComponent]);
});

module.exports = { withKillSwitch };
```

## HOC with class component

### With extra arguments

```js
const { Component } = require('react');
const { wrapHOC, wrapHOCComponent } = require('utils/framework').default;
const React = require('react');

const withAfterEventsRendering = wrapHOC(function withAfterEventsRendering(WrappedComponent, eventsToListen) {
    class AfterEventsRendering extends Component {
        // Implementation details ...
    }

    // Third argument has to be always of type Array and contain all HOC function arguments.
    return wrapHOCComponent(AfterEventsRendering, 'AfterEventsRendering', arguments);
});

module.exports = { withAfterEventsRendering };
```

### Using ES6 syntax

```js
const { Component } = require('react');
const { wrapHOC, wrapHOCComponent } = require('utils/framework').default;
const React = require('react');

const withAfterEventsRendering = wrapHOC((WrappedComponent, eventsToListen) => {
    class AfterEventsRendering extends Component {
        // Implementation details ...
    }

    // Third argument has to be always of type Array and contain all HOC function arguments.
    return wrapHOCComponent(AfterEventsRendering, 'AfterEventsRendering', [WrappedComponent, eventsToListen]);
});

module.exports = { withAfterEventsRendering };
```

### Without extra arguments using ES6 syntax

```js
const { Component } = require('react');
const { compose } = require('redux');
const { wrapHOC, wrapHOCComponent } = require('utils/framework').default;
const React = require('react');

const withAfterSpaRendering = wrapHOC(WrappedComponent => {
    class AfterSpaRendering extends Component {
        // Implementation details ...
    }

    // Third argument has to be always of type Array and contain all HOC function arguments.
    return wrapHOCComponent(AfterSpaRendering, 'AfterSpaRendering', [WrappedComponent]);
});

module.exports = { withAfterSpaRendering };
```

## HOC created by `connect` function

```js
const { connect } = require('react-redux');
const { wrapHOC } = require('utils/framework').default;

const withLoadSpaPageProgress = wrapHOC(connect(({ page: { showLoadSpaPageProgress: showProgress } }) => ({ showProgress })));

module.exports = { withLoadSpaPageProgress };
```

Keep in mind that we do not set `displayName` for any HOC created in application. Using selectors from `reselect` library changes nothing here in a way how we wrap HOC created by `connect` function.

Whenever you decide to create a class HOC always inherit it from `React.Component`. Also do not use `wrapComponent` or `wrapFunctionalComponent`, for wrapping component created within the HOC - use instead [wrapHOCComponent](../utils/framework/README.md#wraphoccomponent) function.

# Composing HOCs

There's a simple way to improve readability and compose HOCs really nicely - using a `compose` function from `redux` library. It is a simple function using native `reduceRight`,
but it makes everything way easier:

```javascript
const { compose } = require('redux');
const withErrorBoundary = require('withErrorBoundary');
const withUserHOC = require('withUserHOC');
const withRenderTimeMeasurements = require('withRenderTimeMeasurements');

const hoc = compose(withErrorBoundary, withUserHOC, withRenderTimeMeasurements);

module.exports = hoc(Component);
```

> HOC created by `compose` function will call original HOCs from right to left, so it will be `withRenderTimeMeasurements`, then `withUserHOC` and `withErrorBoundary` in the end. But components created by each HOC will be rendered from left to right.
