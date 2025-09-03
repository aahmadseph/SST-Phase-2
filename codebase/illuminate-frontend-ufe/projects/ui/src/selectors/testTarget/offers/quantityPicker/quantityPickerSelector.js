import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const quantityPickerSelector = createSelector(testTargetOffersSelector, offers => offers.quantityPicker || Empty.Object);

export { quantityPickerSelector };
