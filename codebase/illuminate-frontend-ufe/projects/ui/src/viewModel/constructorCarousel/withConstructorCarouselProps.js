import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import ConstructorRecsSelector from 'selectors/constructorRecs/constructorRecsSelector';
import preferredStoreInfoSelector from 'selectors/user/preferredStoreInfoSelector';
import ConstructorRecsActions from 'actions/ConstructorRecsActions';
import Location from 'utils/Location';
import localeUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { constructorRecsSelector } = ConstructorRecsSelector;
const { updateRequestData } = ConstructorRecsActions;
const fields = createSelector(constructorRecsSelector, preferredStoreInfoSelector, (constructorRecs = {}, preferredStoreInfo) => {
    const showForCanadaDesktop = localeUtils.isCanada() && !Sephora.isMobile();

    return {
        constructorRecs,
        preferredStoreId: preferredStoreInfo?.storeId || null,
        showBasketGreyBackground: Location.isBasketPage() && showForCanadaDesktop
    };
});

const functions = {
    updateRequestData
};

const withConstructorCarouselProps = wrapHOC(connect(fields, functions));

export {
    withConstructorCarouselProps, fields, functions
};
