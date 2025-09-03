import { createSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';
import { ML_VS_CONSTRUCTOR } from 'constants/TestTarget';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { isUS } = LanguageLocaleUtils;

const constructorVsMLSelector = createSelector(isTestTargetReadySelector, testTargetOffersSelector, (testReady, testTargetOffers) => {
    if (!testReady && testTargetOffers.bestSellers?.experience == null) {
        return null;
    }

    if (!isUS() || (testReady && testTargetOffers.bestSellers?.experience == null)) {
        return ML_VS_CONSTRUCTOR.CONSTRUCTOR;
    }

    return testTargetOffers.bestSellers?.experience;
});

export { constructorVsMLSelector };
