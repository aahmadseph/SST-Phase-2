import { createSelector } from 'reselect';
import { experienceSelector } from 'selectors/testTarget/offers/simplifyPickup/experience/experienceSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';
import { SIMPLIFY_PICKUP_EXPERIENCE } from 'constants/TestTarget';

const showSimplifyPickupSelector = createSelector(isTestTargetReadySelector, experienceSelector, (testReady, experience) => ({
    challengerOne: testReady && experience === SIMPLIFY_PICKUP_EXPERIENCE.CHALLENGER_ONE,
    challengerTwo: testReady && experience === SIMPLIFY_PICKUP_EXPERIENCE.CHALLENGER_TWO
}));

export { showSimplifyPickupSelector };
