# Table of contents for the `components` folder

-   [Table of contents for the `components` folder](#table-of-contents-for-the-components-folder)
-   [Overview](#overview)
-   [Code convention](#code-convention)
-   [Performance hints](#performance-hints)
    -   [Empty Class: Static Methods](#empty-class-static-methods)
    -   [Basic List Components Keys](#basic-list-components-keys)
    -   [Attributes](#attributes)
    -   [Optimize long tasks by deferTaskExecution](#defertaskexecution)
-   [Variants of `index.js` file implementations](#variants-of-indexjs-file-implementations)
    -   [Default implementation](#default-implementation)
    -   [Implementation with HOC usage](#implementation-with-hoc-usage)
    -   [Implementation with multiple HOCs used - option #1](#implementation-with-multiple-hocs-used---option-1)
    -   [Implementation with multiple HOCs used - option 2](#implementation-with-multiple-hocs-used---option-2)

# Overview

The old documentation lives [here](../../../documentation/old-components.md).

This is a folder for all components in the application. It represents `View Layer` which is part of `MVVM` design pattern. The `View Layer` defines the UI using `JSX` markup.

If your component needs to connect to the store you will need to use react-redux and selectors. You can find more information on connecting components with the store in the [documentation for react-redux](../viewModel/README.md)

Basic examples of how to implement a component can be found below.

# Code convention

In addition to [base rules defined here](../../../README.md) we have several more specific ones for files in the `components` folder.

-   Every new component has to be created in a folder with the same name as the component.
-   The component folder should contain only 2 files: `index.js` and conponent's (`*.f.jsx|*.es6.jsx|*.ctrlr.jsx`) file.
-   Folder can have sub-folders, in these sub-folders there should be only components created using the same rules.
-   By default the `index.js` file should re-export the component from the same folder.
-   If you want to wrap a component with a HOC(s) - do it in `index.js` file.
-   Do not set component's `displayName` anywhere.
-   Every component should have `propTypes` and it has to be defined right before `module.exports` definition.
-   Optional fields defined in `propTypes` should have their default values in `defaultProps`.
-   Every component has to be wrapped with [Framework API](../utils/framework/README.md) function:

    > Example of functional (`*.f.jsx`) component:

    ```js
    const { wrapFunctionalComponent } = require('utils/framework');
    const React = require('react');
    const Root = require('components/Root');

    const SpaApplication = () => <Root />;

    SpaApplication.propTypes = {};

    module.exports = wrapFunctionalComponent(SpaApplication, 'SpaApplication');
    ```

    > Example of class (`*.es6.jsx`) component:

    ```js
    const { wrapComponent } = require('utils/framework');
    const BaseClass = require('components/BaseClass').default;
    const React = require('react');

    class Expandable extends BaseClass {
        constructor(props) {
            super(props);

            this.state = { expanded: false };
        }

        render() {
            // JSX implementation...
        }

        toggle = () => this.setState(({ expanded }) => ({ expanded: !expanded }));
    }

    Expandable.propTypes = {
        //component props types definition...
    };

    module.exports = wrapComponent(Expandable, 'Expandable');
    ```

    > Example of class (`*.ctrlr.jsx`) component:

    ```js
    const { Container } = require('components/ui');
    const { wrapComponent } = require('utils/framework');
    const BaseClass = require('components/BaseClass').default;
    const olapicUtils = require('utils/Olapic').default;
    const React = require('react');

    class AddOlapicPhoto extends BaseClass {
        render() {
            return (
                <Container
                    is='main'
                    hasLegacyWidth={true}
                >
                    <div id='olapic-widget' />
                </Container>
            );
        }

        componentDidMount() {
            olapicUtils.includeOlapicScripts();
            olapicUtils.startUploader('olapic-widget');
        }
    }

    AddOlapicPhoto.propTypes = {
        //component props types definitions...
    };

    module.exports = wrapComponent(AddOlapicPhoto, 'AddOlapicPhoto', true);
    ```

-   Avoid of creating components with more than `500` lines of code. Usually it's a sign that you need to split component into several smaller components.

-   Binding has to be used always in `JSX` instead of inlining expressions. Otherwise we get performance degradation as this pattern forces component to re-render always.

    > BAD

    ```js
    return (
        <Button
            text={'Title: ' + props.text}
            onClick={e => props.onButtonClicked(e)}
        />
    );
    ```

    > GOOD

    ```js
    render() {
        return (
            <Button
                text={props.buttonTitle}
                onClick={props.onButtonClicked}
            />
        );
    }

    // or
    render() {
        return (
            <Button
                text={props.buttonTitle}
                onClick={this.onButtonClicked}
            />
        );
    }

    onButtonClicked = event => {
        event.preventDefault();
        this.props.onButtonClicked();
    }
    ```

-   Don't duplicate/save data from Redux state (data from `props` object) into component's local state. This is a dataflow issue and anti-pattern in general. It forces the use of `this.setState` function which does extra re-renderings.

    > BAD

    ```js
    class MyComponent extends BaseClass {
        state = { product: this.props.product };
    }
    ```

-   Don't assign values to `this.state` directly. Always use `this.setState` function to update the state. Direct assignment to `this.state` will not trigger a re-rendering of the component.

    > BAD

    ```js
    const newState = this.state;
    newState.sku = someData.sku;
    this.setState({ ...newState });
    ```

    > BETTER

    ```js
    const newState = { ...this.state };
    ```

    > BEST

    ```js
    this.setState(prevState => {
        const newState = { ...prevState };
        // do some work with newState object
        return newState;
    });
    ```

-   Work with `window` object in component's render function has to be done conditionally. This condition should evaluate to `false` for SSR and during React's hydration phase.

    > BAD

    ```js
    // Example #1: will raise exception during SSR as window object is not defined in Node.
    render () {
        let size = IMAGE_SIZE[0];

        if (window.matchMedia(breakpoints.smMin).matches) {
            size = IMAGE_SIZE[1];
        }

        // JSX implementation...
    }

    // Example #2: will cause React "hydration mismatch" issue. During hydration phase we should render exactly the same HTML as it was generated after SSR.
    render () {
        let size = IMAGE_SIZE[0];

        if (!Sephora.isNodeRender) {
            if (window.matchMedia(breakpoints.smMin).matches) {
                size = IMAGE_SIZE[1];
            }
        }

        // JSX implementation...
    }
    ```

    > GOOD

    ```js
    // Example #1: HydrationFinished flag evaluates to true only on client side after React hydration process is finished.
    render () {
        let size = IMAGE_SIZE[0];

        if (Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished) {
            if (window.matchMedia(breakpoints.smMin).matches) {
                size = IMAGE_SIZE[1];
            }

        }

        // JSX implementation...
    }

    // Example #2: it's an improvement of the example #1. Body of the if statement will be removed by Webpack during dundling process for the server build configuration. It also helps to decrease the size of the server bundle.
    render() {
        let size = IMAGE_SIZE[0];

        if (!Sephora.isNodeRender && Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished) {
            if (window.matchMedia(breakpoints.smMin).matches) {
                size = IMAGE_SIZE[1];
            }
        }

        // JSX implementation...
    }
    ```

# Performance hints

## Empty Class: Static Methods

-   **Default Values:** Ensure your functions return consistent data types. Use the logical OR (||) operator to provide default values like Empty.String, Empty.Array, or Empty.Object when your code is expected to return String, Array, or Object types.
-   **Memory Allocation:** Avoid returning Object or Array literals ({} or []) directly. Each time these literals are returned, a new memory space is allocated, which can increase memory usage and potentially degrade performance, especially with frequent function calls.
-   **Reference Equality:** Returning new Object or Array literals can cause issues with reference equality checks (===). Even identical literals are not strictly equal, as each is a new instance. This can lead to unexpected behavior when comparing returned objects or arrays from multiple function calls.
-   **Optimized Returns:** Use predefined Empty.String, Empty.Array, or Empty.Object to ensure the same memory reference is used each time. This optimizes memory usage, avoids potential issues with reference equality checks, and provides a reliable, efficient way to handle cases where your function needs to return an empty string, array, or object.

    > BAD

    ```js
    const myArray = new Array('data1', 'data2', 'data3');
    const someTernary = myArray && myArray.length > 0 ? myArray : [];

    return someTernary;
    ```

    > GOOD

    ```js
    import Empty from 'constants/empty';

    const myArray = new Array('data1', 'data2', 'data3');
    const someTernary = myArray && myArray.length > 0 ? myArray : Empty.Array;

    return someTernary;
    ```

## Basic List Components Keys

Regularly we render lists inside components, the `key` prop helps React identify which items have to be modified, added or deleted. “The best way to pick a key is to use a string that uniquely identifies a list item among its siblings. Most often you would use IDs from your data as keys”.

Some rules:

-   Keys only make sense in the context of the surrounding array.
-   The best way to pick a key is to use a string that uniquely identifies a list item among its siblings. Most often you would use IDs from your data as keys.
-   Keys used within arrays should be unique among their siblings. However, they don’t need to be globally unique.
-   When you don’t have stable IDs for rendered items, you may use the item index as a key as a last resort.

## Attributes

In `JSX` do not set element properties using syntax `attributeOne={{...}}` or `attributeTwo={[...]}`. Otherwise component always re-renders because of re-creation of the new object used as a value for property. See [reference implementation](https://github.com/Sephora-US-Digital/illuminate-frontend-ufe/blob/dev/public_ufe/js/components/Checkout/Sections/SddSections/BaseSection.f.jsx).

> BAD

```js
<Text
    is='h2'
    css={{
        color: colors.black,
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        lineHeight: '20px',
        [mediaQueries.md]: {
            fontSize: fontSizes.xl,
            lineHeight: '29px'
        }
    }}
>
    {title}
</Text>
```

> GOOD

```js
// inside component's code
<Text
    is='h2'
    css={styles.titleBlack}
>
    {skuInfo}
</Text>;

// outside of componet's code
const style = {
    titleBlack: {
        color: colors.black,
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        lineHeight: '20px',
        [mediaQueries.md]: {
            fontSize: fontSizes.xl,
            lineHeight: '29px'
        }
    }
};
```

-   Do not inline function implementation into event handler directly. It causes performance issue - it forces child component to always re-render whenever parent component is rendered.

    > BAD

    ```js
    <Button onClick={event => this.props.onClicked(event)} />
    ```

    > GOOD

    ```js
    <Button onClick={this.props.onClicked} />
    ```

    or if we need to extract data (or do some other UI only related work like `preventDefault` function call) from event handler argument before calling a `View Model` method that dispatches an action.

    > BAD

    ```js
    render () {
        const { children: Wrapper } = this.props;

        return (
            <Wrapper>
                <TextBox
                    onChange={event => {
                        event.preventDefault();
                        this.props.saveChanges(event.target.value);
                    }}
                />
            </Wrapper>
        );
    }
    ```

    > GOOD

    ```js
    onTextChanged = event => {
        event.preventDefault();
        this.props.saveChanges(event.target.value);
    }

    render () {
        const { children: Wrapper } = this.props;

        return (
            <Wrapper>
                <TextBox onChange={this.onTextChanged} />
            </Wrapper>
        );
    }

    ```

## Optimize long tasks by deferTaskExecution

Optimize long tasks to not block the main thread. Use `deferTaskExecution` function to defer non-critical work to a separate task. This function is available in `utils/Helpers` module.

> BAD

```js
function saveSettings() {
    validateForm();
    showSpinner();
    updateUI();
    saveToDatabase();
    sendAnalytics();
}
```

> GOOD

```js
function saveSettings() {
    // Do critical work that is user-visible:
    validateForm();
    showSpinner();
    updateUI();

    // Defer work that isn't user-visible to a separate task:
    deferTaskExecution(() => {
        saveToDatabase();
        sendAnalytics();
    });
}
```

# Variants of `index.js` file implementations

If you want to wrap component with HOC then it has to be done in `index.js` file.

## Default implementation

```js
const Items = require('components/Items/Items');

module.exports = Items;
```

## Implementation with HOC usage

```js
const Items = require('components/Items/Items');
const { withItemsProps } = require('viewModel/items/withItemsProps');

module.exports = withItemsProps(Items);
```

## Implementation with multiple HOCs used - option #1

```js
const { withAfterSpaRendering } = require('hocs/withAfterSpaRendering').default;
const { withItemsProps } = require('viewModel/items/withItemsProps');
const Items = require('components/Items/Items');

module.exports = withAfterSpaRendering(withItemsProps(Items));
```

## Implementation with multiple HOCs used - option 2

This implementation has limitation which does not allow to pass arguments into each HOC.

```js
const { compose } = require('redux');
const { withAfterSpaRendering } = require('hocs/withAfterSpaRendering').default;
const { withItemsProps } = require('viewModel/items/withItemsProps');
const Items = require('components/Items/Items');

const withCombinedHOC = compose(withAfterSpaRendering, withItemsProps);

module.exports = withCombinedHOC(Items);
```
