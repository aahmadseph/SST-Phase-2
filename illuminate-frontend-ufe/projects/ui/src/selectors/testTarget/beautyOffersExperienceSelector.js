import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';
import safelyReadProp from 'analytics/utils/safelyReadProperty';

const beautyOffersExperienceSelector = createSelector(testTargetOffersSelector, testTargetOffers =>
    safelyReadProp('MLDrivenPromos.result.experience', testTargetOffers)
);

export default beautyOffersExperienceSelector;
