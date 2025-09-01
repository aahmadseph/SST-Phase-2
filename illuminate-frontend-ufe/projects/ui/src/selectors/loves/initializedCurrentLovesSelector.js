import { createSelector } from 'reselect';
import { lovesSelector } from 'selectors/loves/lovesSelector';
import myListsUtils from 'utils/MyLists';

const isSharableListEnabled = myListsUtils.isSharableListEnabled();

const initializedCurrentLovesSelector = createSelector(lovesSelector, ({ currentLoves, currentLovesSkuDetails, currentLovesIsInitialized }) => {

    return {
        currentLoves: isSharableListEnabled ? currentLovesSkuDetails : currentLoves,
        currentLovesIsInitialized
    };
});

export default initializedCurrentLovesSelector;
