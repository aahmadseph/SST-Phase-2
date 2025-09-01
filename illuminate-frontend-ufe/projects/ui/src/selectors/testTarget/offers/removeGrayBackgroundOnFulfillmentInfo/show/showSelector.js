import { createSelector } from 'reselect';
import { removeGrayBgOnFulfillmentInfoSelector } from 'selectors/testTarget/offers/removeGrayBackgroundOnFulfillmentInfo/removeGrayBackgroundOnFulfillmentInfoSelector';

const showSelector = createSelector(
    removeGrayBgOnFulfillmentInfoSelector,
    removeGrayBgOnFulfillmentInfo => !!removeGrayBgOnFulfillmentInfo.show
);

export { showSelector };
