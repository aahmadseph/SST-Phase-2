# Table of contents for the `selectors` folder

-   [Table of contents for the `selectors` folder](#table-of-contents-for-the-selectors-folder)
-   [Overview](#overview)
-   [Code convention](#code-convention)

# Overview

A "selector function" is any function that accepts the `Redux` store state (or part of the state) as an argument, and returns data that is based on that state. All selectors within the `projects/ui/src/selectors/` folder are designed only to read raw data from `Redux` store without any transformation(s) or modification(s) and they should not use any other helper function(s). Reusable selectors with data transformation or creation logic and|or usage of utils functions should be defined within the `projects/ui/src/viewModel/selectors/` folder.

# Code convention

In addition to [base rules defined here](../../../README.md) we have couple more specific for files in `actions` folder.

-   All files and folders within `projects/ui/src/selectors/` folder should be created using `camelCase` naming convention.
-   All selectors should have `Selector` postfix. Pattern: <em>`{fieldName}`</em>`Selector.js`. Example: `historyLocationSelector.js`, `productSkusSelector`, etc.
-   Selectors in `projects/ui/src/selectors` folder should return only unmodified data from redux store. They should do nothing else. Selectors with data transforms (invocation of any util function(s) or any data transformation(s)/mutation(s)) has to be defined within the `projects/ui/src/viewModel/selectors` folder.
-   Every selector should export itself via named export syntax.

```js
// selectors/data/dataSelector.js
import Empty from 'constants/empty';

const dataSelector = store => store.data || Empty.Object;

export default { dataSelector };
```

-   If selector returns data of type `String`, `Array` or `Object` add logical OR (`||`) operator and return `Empty.String`, `Empty.Array` or `Empty.Object` respectively.
-   The folder name for the selector should match the selectors property name. It's required for fields of type `Array` and `Object` only.

```js
// selectors/data/items/itemsSelector.js
import { createSelector } from 'reselect';
import { dataSelector } from 'selectors/data/dataSelector';
import Empty from 'constants/empty';

const itemsSelector = createSelector(dataSelector, data => data.items || Empty.Array);

export default { itemsSelector };
```

-   Selector can require and reuse another selector(s). **MIND CIRCULAR DEPENDENCIES.**
-   It's allowed to create composite selectors. Format this type of selectors as in example below.

```js
import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';

const preferredStoreSelector = createSelector(userSelector, user => ({
    preferredStoreInfo: user.preferredStoreInfo,
    preferredStoreName: user.preferredStoreName
}));

export default { preferredStoreSelector };
```
