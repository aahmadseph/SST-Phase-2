# Table of contents for the `viewModel` folder

-   [Table of contents for the `viewModel` folder](#table-of-contents-for-the-viewmodel-folder)
-   [Overview](#overview)
-   [Code convention](#code-convention)
    -   [HOCs](#hocs)
    -   [Selectors](#selectors)
        -   [Anti-patterns](#anti-patterns)
-   [HOC examples](#hoc-examples)
    -   [Basic HOC implementation](#basic-hoc-implementation)
    -   [Basic HOC implementation with actions usage](#basic-hoc-implementation-with-actions-usage)
        -   [Defining `mapDispatchToProps` as an Object](#defining-mapdispatchtoprops-as-an-object)

# Overview

Think about HOCs in `viewModel` folder as a specific `props` provider (data source/context) for the specific component. The `View Model` creates a representation of the `Model` for the specific component.

Component's code should not do any data transformation or creation operations for the data we have in `props` object (it has to be used as is). We use selectors for that work in HOCs as they use caching and it gives us a performance boost by avoiding extra component re-renderings on every `Redux` state update. In some cases, the `ViewModel` exposes the model directly (when we use `createStructuredSelector` function), or provides members that wrap specific model members (when we use `createSelector` function). Also the `ViewModel` can define members for tracking of data that is relevant to the `UI` but not to the `Model` layer, such as the display order of a list of items. The `ViewModel` layer also serves as an integration point with other services such as database-access code (API call). For simple projects, you might not need a separate model layer, but only a `ViewModel` that encapsulates all the data component needs. In our application it will be a HOC created by `connect` function from `react-redux` library (when we need to read/write data from/to Redux state) or manually created HOC. This design allows us to create truly reusable components and also it allows us to implement entire `UI` without having a back-end at all because in HOCs we can mock all required data or behaviour.

# Code convention

## HOCs

A HOC should be created with help of the `connect` function when we need to read/write data from/into Redux state. In addition to [base rules defined here](../hocs/README.md) and [here](../../../README.md) we have couple more specific rules for HOCs in `viewModel` folder:

-   Component should be wrapped with HOC(s) inside it's `index.js` file. For more details and examples read [documentation for components](../components/README.md#implementation-with-hoc-usage).
-   Any HOC in the `viewModel` folder must have the prefix `with` and postfix `Props`. The component's name goes in between prefix and postfix. As an example, the HOC file name for the `Basket.ctrlr.jsx` component will be - `withBasketProps.js`.
-   The file path of the HOC in `viewModel` should replicate the same path we have in the component's folder for the component being wrapped.
-   HOCs in `viewModel` folder created by `connect` function should not have dependency on `React` library.
-   HOC's file should export HOC itself and also `fields`, and `functions` for testing purposes (names of these variables should be `fields` and `functions`).
-   Every HOC has to be wrapped with [wrapHOC](../utils/framework/README.md#wraphoc) function. See [example](../hocs/README.md#hoc-with-extra-arguments).
-   Components created within a manually created HOC have to be wrapped with [wrapHOCComponent](../utils/framework/README.md#wraphoccomponent). See [example](../hocs/README.md#hoc-with-extra-arguments).
-   To analise time spent on HOC rendering plus selector execution use this command in browser's terminal - `Sephora.performance.renderTime.printOutHOCsStatistics()`.

## Selectors

When a HOC is created by the `connect` function we use selectors to read data from `Redux` store to increase performance of this process. We have selectors defined in `projects/ui/src/selectors/` folder, HOC files and `projects/ui/src/viewModel/selectors` folder. As it was mentioned in [documentation](../selectors/README.md) for `projects/ui/src/selectors/` folder these selectors are only to read raw data from `Redux` store without any data transformation(s), modification(s) or creation(s) and they should not use any other helper or util function(s). Code in these selectors belongs to `Model` layer. Reusable selectors with custom logic like data transformation and|or usage of utils functions should be defined within the `projects/ui/src/viewModel/selectors/` folder. These selectors belongs to `ViewModel` layer. Same technique/lib is used in both cases but responsibility is different. The last place for selectors is HOC file itself. Complexity of these selectors can be the same as for selectors in `projects/ui/src/viewModel/selectors` folder with only one difference - they are not reusable.

-   Selector used only in one HOC should be declared in the same HOC file. We do not extract this type of selectors into separate files.
-   Every selector within the HOC's file should be defined in separate local variable `fields`. See [example](#basic-hoc-implementation).
-   When selector is created with help of `createSelector` function then none of the input selectors should create new object and return it! That will force the output selector to always recalculate. See examples in below section `Anti-patterns`.
-   Never do expensive type of operations in input selectors such as data transformations/mutations, API calls, time consuming calculations as `they are invoked on every Redux state update`.
-   Never use browser dependent code in selectors since they are typically rendered server side and this will cause an error. An example would be to try to access local storage.

### Anti-patterns

-   Wrong selector is used to monitor for the changes in `Redux` state. We should watch specifically only for the data we are interested in. Otherwise component will be re-rendered more often because of the changes in other fields of the parent/root object for which we used the selector.

    > BAD

    ```js
    const { testTargetOffersSelector } = require('selectors/testTarget/offers/testTargetOffersSelector');

    const fields = createSelector(testTargetOffersSelector, offers => {
        const showPricesOnCarouselTiles = offers.productPricesOnCarouselTiles?.show;

        return { showPricesOnCarouselTiles };
    });
    ```

    > GOOD

    ```js
    const { showSelector } = require('selectors/testTarget/offers/productPricesOnCarouselTiles/show/showSelector').default;

    const fields = createSelector(showSelector, show => {
        const showPricesOnCarouselTiles = show;

        return { showPricesOnCarouselTiles };
    });
    ```

-   Second input selector creates a new object and returns it. The output selector will be recalculated always.

    > BAD

    ```js
    const fields = createSelector(
        itemsSelector,
        (_state, ownProps) => ({
            pageNumber: ownProps.pageNumber,
            pageSize: ownProps.pageSize
        }),
        (items, { pageNumber, pageSize }) => {
            const start = pageSize * pageNumber - pageNumber;
            const end = start + pageSize;
            const itemsPage = items.slice(start, end);

            return { itemsPage };
        }
    );
    ```

    > GOOD

    ```js
    const fields = createSelector(
        itemsSelector,
        (_state, ownProps) => ownProps.pageNumber,
        (_state, ownProps) => ownProps.pageSize,
        (items, pageNumber, pageSize) => {
            const start = pageSize * pageNumber - pageNumber;
            const end = start + pageSize;
            const itemsPage = items.slice(start, end);

            return { itemsPage };
        }
    );
    ```

-   Memoized selector should never use `state => state` as an input! That will force the output selector to always recalculate.

    > BAD

    ```js
    const fields = createSelector(
        itemsSelector,
        state => state,
        (items, state) => {
            // Implementation details ...
        }
    );
    ```

-   Any `output selector` that just returns its inputs is incorrect! The output selector should always have the transformation logic. If you don't need transformation logic use createStructuredSelector function instead.

    > BAD

    ```js
    const fields = createSelector(
        store => store.data,
        data => data
    );
    ```

-   Work with `window` object in selector has to be done conditionally. This condition should evaluate to `false` for SSR and during React's hydration phase.

    > BAD

    ```js
    // Example #1: will raise exception during SSR as window object is not defined in Node.
    const imageSize = createSelector(imageSizeSelector, imageSize => {
        let size = imageSize[0];

        if (window.matchMedia(breakpoints.smMin).matches) {
            size = imageSize[1];
        }

        // Implementation details ...
    );

    // Example #2: will cause React "hydration mismatch" issue. During hydration phase we should render exactly the same HTML as it was generated after SSR.
    const imageSize = createSelector(imageSizeSelector, imageSize => {
        let size = imageSize[0];

        if (!Sephora.isNodeRender) {
            if (window.matchMedia(breakpoints.smMin).matches) {
                size = imageSize[1];
            }
        }

        // Implementation details ...
    );
    ```

    > GOOD

    ```js
    // Example #1: HydrationFinished flag evaluates to true only on client side after React hydration process is finished.
    const imageSize = createSelector(imageSizeSelector, imageSize => {
        let size = imageSize[0];

        if (Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished) {
            if (window.matchMedia(breakpoints.smMin).matches) {
                size = imageSize[1];
            }
        }

        // Implementation details ...
    );

    // Example #2: it's an improvement of the example #1. Body of the if statement will be removed by Webpack during dundling process for the server build configuration. It also helps to decrease the size of the server bundle.
    const imageSize = createSelector(imageSizeSelector, imageSize => {
        let size = imageSize[0];

        if (!Sephora.isNodeRender && Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished) {
            if (window.matchMedia(breakpoints.smMin).matches) {
                size = imageSize[1];
            }
        }

        // Implementation details ...
    );
    ```

-   Do not write JSX in hocs in viewModels, the purpose of viewModels is to connect the component to the store data. Instead keep those in existing template files or create a new template. Passing a component in through the props busts the component caching we have and will force a re-render.

    > BAD

    ```js
    const fields = createSelector(coreUserDataSelector, user => {
        const component = <Component prop='string' />;

        return {
            user,
            component
        };
    });

    const withProps = wrapHOC(connect(fields));
    ```

-   When passing props from a parent into connected child component, if you pass in an object with a parameter that has changed but don't include it in your selector, it will get ignored. You can handle this using a (state, ownProps) selector that checks the props to see if they have changed.

    > EXAMPLE

    ```js
    const fields = createSelector(
        coreUserDataSelector,
        (_state, ownProps) => ownProps.headerFooterContent,
        (_state, ownProps) => ownProps.personalization,
        (user, headerFooterContent, personalization) => {
            // Data transforms go here

            return {
                user,
                headerFooterContent,
                personalization
            };
        }
    );
    const withProps = wrapHOC(connect(fields));
    ```

# HOC examples

## Basic HOC implementation

Passing data from `Redux` state into component with help of selector.

```js
const { connect } = require('react-redux');
const { createStructuredSelector } = require('reselect');
const { wrapHOC } = require('utils/framework');
const basketSelector = require('selectors/basket/basketSelector').default;

const fields = createStructuredSelector({ basket: basketSelector });
const withActionButtonsProps = wrapHOC(connect(fields));

module.exports = {
    fields,
    withActionButtonsProps
};
```

## Basic HOC implementation with actions usage

Passing data from `Redux` state into component with additional functions (actions) to mutate `Redux` state.

### Defining `mapDispatchToProps` as an Object

You’ve seen that the setup for dispatching `Redux` actions in a `React` component follows a very similar process: define an action creator, wrap it in another function that looks like `(…args) => dispatch(actionCreator(…args))`, and pass that wrapper function as a prop to your component.

Because this is so common, `connect` supports an “**object shorthand**” form for the `mapDispatchToProps` argument: if you pass an object full of action creators instead of a function, connect will automatically call `bindActionCreators` for you internally.

We recommend always using the “**object shorthand**” form of `mapDispatchToProps`, unless you have a specific reason to customize the dispatching behavior.

```js
const { connect } = require('react-redux');
const { createStructuredSelector } = require('reselect');
const { wrapHOC } = require('utils/framework');
const Actions = require('Actions').default;
const BasketActions = require('actions/AddToBasketActions').default;
const basketSelector = require('selectors/basket/basketSelector').default;
const LoveActions = require('actions/LoveActions').default;
const ProductSpecificActions = require('actions/ProductSpecificActions').default;
const PromoActions = require('actions/PromoActions').default;
const userSelector = require('selectors/user/userSelector');

const fields = createStructuredSelector({
    basket: basketSelector,
    user: userSelector
});
const functions = {
    removeItemFromBasket: AddToBasketActions.removeItemFromBasket,
    refreshBasket: AddToBasketActions.refreshBasket,
    showQuickLookModal: Actions.showQuickLookModal,
    addLove: LoveActions.addLove,
    fetchProductSpecificDetails: ProductSpecificActions.fetchProductSpecificDetails,
    updateQuickLookContent: Actions.updateQuickLookContent,
    removeMsgPromosByCode: PromoActions.removeMsgPromosByCode
};
const withBasketListItemProps = wrapHOC(connect(fields, functions));

module.exports = {
    fields,
    functions,
    withBasketListItemProps
};
```
