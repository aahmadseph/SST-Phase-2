import { createSelector } from 'reselect';
import { showSelector } from 'selectors/testTarget/offers/removeGrayBackgroundOnFulfillmentInfo/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const showRemoveGrayBgOnFulfillmentInfoSelector = createSelector(
    isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show
);

export { showRemoveGrayBgOnFulfillmentInfoSelector };
