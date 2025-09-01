# Table of contents for the `actions` folder

-   [Overview](#overview)
-   [Code convention](#code-convention)
    -   [Actions](#actions)
    -   [Async actions](#async-actions)
-   [SPA navigation](#spa-navigation)
    -   [Class diagram](#class-diagram)
    -   [Sequence diagram](#sequence-diagram)
    -   [Types information](#types-information)
        -   [ILocation](#ilocation)
        -   [IPageNavigationContext](#ipagenavigationcontext)
        -   [IPageActionCreators](#ipageactioncreators)
        -   [PageActionCreators](#pageactioncreators)

# Overview

An action creator is, quite simply, a function that creates an action. Do not confuse the two terms. An action is a payload of information, and an action creator is a factory that creates an action. Calling an action creator only produces an action, but does not dispatch it. You need to call the store's `dispatch` function to actually cause the mutation. Action types should be defined within the folder `projects/ui/constants/actionTypes/` and **not in action or reducer files**.

# Code convention

In addition to [base rules defined here](../../../README.md) we have couple more specific for files in `actions` folder.

## Actions

Actions are plain `JavaScript` objects that have `type` and `payload` fields. You can think of an action as an event that describes something that happened in the application. We normally put any extra data needed to describe what's happening into the `action.payload` field. This could be a `Number`, `String`, `Boolean`, `Array` or an `Object` with multiple fields inside.

> Example of an action creator which returns action

```js
const { SET_DATA_ITEMS } = require('constants/actionTypes/data');

const setDataItems = items => ({
    type: SET_DATA_ITEMS,
    payload: items
});
```

## Async actions

If an action creator needs to read the current state, perform an API call, or cause a side effect, like a routing transition, it should return an async action instead of an action. An async action is a function (with 2 arguments: `dispatch` and `getState`) which has to return a promise. Following this pattern allows to know for external code when an async action is completed.

> Example of an action creator which returns async action

```js
const loadItems = () => (dispatch, _getState) => {
    // Emulation of API call.
    return Promise.resolve(['item1', 'item2']).then(items => dispatch(setDataItems(items)));
};
```

# SPA navigation

Current standard for SPA page navigation is usage of `.navigateTo(event, targetURL)` function from Location API `require('utils/Location')`. Every page has a file with all action creators associated with it. All action creators should be defined within class. Class naming template is `{PageName}ActionCreators`. JS module should export not a class but instance of it - object. To enable SPA navigation, a class must inherit from the [PageActionCreators](#pageactioncreators) class and provide implementation of the functions (`isNewPage`, `openPage`, `updatePage`) defined in it. See example in [ProductActions](../actions/ProductActions.js). And the last step is to update mapping between page template and associated with this page action creators file. This [constants/spaPagesActions.js](../constants/spaPagesActions.js) file is responsible for the mapping.

When `navigateTo` function is called and SPA navigation is possible for target URL, function `isNewPage(pageContext)` fires automatically. When it returns `true` the `openPage` function is invoked next, otherwise `updatePage` is called. The `openPage` function is responsible for navigation to the new page when `updatePage` is for updates of the current page. All these 3 functions (`isNewPage`, `openPage`, `updatePage`) receive one argument `pageContext` of type [IPageNavigationContext](#ipagenavigationcontext).

SPA navigation has several "lifecycle events" that you have to use within `openPage` function implementation. Lifecycle events are defined in `events` field of the pageContext object. These methods have to be called in the following order when `openPage` function fires:

-   onDataLoaded
-   onPageUpdated
-   onError

To render a new page we need data for it, so we make an API call(s), and only when we have data, we fire `onDataLoaded` event, passing data from API as the first argument. Invocation of this function begins multisteps page update process which should be ended with `onPageUpdated` function call. In case of exception `onError` event should be used. It's like database transaction mechanism - we start page update process with `onDataLoaded` (BEGIN TRANSACTION) function call and finish it with `onPageUpdated` (COMMIT TRANSACTION) call. In case of exception we have to rollback this process so we do a call of `onError` (ROLLBACK TRANSACTION) function.

The `onPageUpdated` function accepts a callback as a second argument and it plays very important role from performance point of view. It allows to execute some code before code in `onPageUpdated` function and do it in a new and separate [task](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide#tasks). Because of this we can split page update process into two chunks. This technique allows the browser to redraw the UI before another task starts running. For instance on product page we do 2 API calls(`getProductDetails` and `getUserSpecificProductDetails`). It allows us to show/display new SPA page ASAP when only primary data for the page is ready (`getProductDetails`) and all minor updates (`getUserSpecificProductDetails`) we move into callback.

> We increase speed of initial SPA page rendering by moving all minor page updates (like user specific data) into callback.

## Class diagram

[![SPA navigation class diagram](../../../documentation/artifacts/spaNavigationClassDiagram.svg)](https://lucid.app/lucidchart/5a489d59-5c66-4e8f-bb2d-05a883ed5e03/edit?viewport_loc=-432%2C-87%2C3072%2C1555%2CHWEp-vi-RSFO&invitationId=inv_11450988-c8b8-449c-b305-7a288d66c6de)

## Sequence diagram

[![SPA navigation sequence diagram](../../../documentation/artifacts/spaNavigationSequenceDiagram.svg)](https://lucid.app/lucidchart/7f350276-8a8e-4ab5-9528-9aceb9dfe0a2/edit?viewport_loc=-1455%2C-266%2C5286%2C2675%2C0_0&invitationId=inv_1db80a8c-085d-41f8-ae12-107fbb159a3b)

## Types information

### ILocation

```ts
interface ILocation {
    path: string;
    queryParams: {
        [key: string]: Array;
    };
    anchor: string;
}
```

### IPageNavigationContext

```ts
interface IPageNavigationContext {
    events: {
        onDataLoaded: (newData: any, imagesToPreload: []) => void;
        onError: (error: Error) => void;
        onPageUpdated: (data: any, callback: () => void) => void;
    };
    newLocation: ILocation;
    previousLocation: ILocation;
    requestConfig: { abortable: boolean };
    newPageTemplate: PageTemplateType; // constants/PageTemplateType.js
}
```

### IPageActionCreators

```ts
interface IPageActionCreators {
    isNewPage: (pageContext: IPageNavigationContext) => boolean;
    openPage?: (pageContext: IPageNavigationContext) => void;
    updatePage?: (pageContext: IPageNavigationContext) => void;
}
```

### PageActionCreators

```ts
class PageActionCreators implements IPageActionCreators {
    isNewPage(pageContext: IPageNavigationContext) {
        throw new NotImplementedException();
    }

    openPage(pageContext: IPageNavigationContext) {
        throw new NotImplementedException();
    }

    updatePage(pageContext: IPageNavigationContext) {
        throw new NotImplementedException();
    }
}
```
