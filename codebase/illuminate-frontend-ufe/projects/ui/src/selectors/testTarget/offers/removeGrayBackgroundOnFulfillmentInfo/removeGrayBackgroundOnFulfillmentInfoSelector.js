import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const removeGrayBgOnFulfillmentInfoSelector = createSelector(
    testTargetOffersSelector, offers => offers.removeGrayBackgroundOnFulfillmentInfo || Empty.Object
);

export { removeGrayBgOnFulfillmentInfoSelector };
