import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import Actions from 'Actions';
import store from 'Store';
import initializedCurrentLovesSelector from 'selectors/loves/initializedCurrentLovesSelector';
import localeUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';
import Location from 'utils/Location';
import { HEADER_VALUE } from 'constants/authentication';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = localeUtils;
const getText = getLocaleResourceFile('components/Content/LovesList/locales', 'LovesList');

const localization = createStructuredSelector({
    signInButton: getTextFromResource(getText, 'signInButton'),
    signInText: getTextFromResource(getText, 'signInText'),
    yourLoves: getTextFromResource(getText, 'yourLoves'),
    yourSavedItems: getTextFromResource(getText, 'yourSavedItems')
});

const currentLovesSelector = createSelector(initializedCurrentLovesSelector, ({ currentLoves }) => currentLoves);

const fields = createSelector(currentLovesSelector, localization, (loves, locale) => {
    const showForCanadaDesktop = localeUtils.isCanada() && !Sephora.isMobile();

    return {
        currentLoves: loves,
        isUserRecognized: userUtils.isUserAtleastRecognized(),
        localization: locale,
        showBasketGreyBackground: Location.isBasketPage() && showForCanadaDesktop
    };
});

const functions = {
    showSignInModal: () => {
        store.dispatch(Actions.showSignInModal({ isOpen: true, extraParams: { headerValue: HEADER_VALUE.USER_CLICK } }));
    }
};

const withLovesListProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withLovesListProps
};
