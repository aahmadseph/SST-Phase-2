import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const showItemSubstitutionSelector = createSelector(testTargetOffersSelector, offers => offers.showItemSubstitution || Empty.Object);

export { showItemSubstitutionSelector };
