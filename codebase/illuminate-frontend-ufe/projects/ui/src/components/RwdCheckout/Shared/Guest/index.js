import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import GuestSavePointsCheckbox from 'components/RwdCheckout/Shared/Guest/GuestSavePointsCheckbox';
import CheckoutUtils from 'utils/Checkout';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/Shared/Guest/locales', 'GuestSavePointsCheckbox');

const textResources = createStructuredSelector({
    joinOurFreeProgramText: getTextFromResource(getText, 'joinOurFreeProgramText')
});

const connectedGuestSavePointsCheckbox = connect(
    createSelector(textResources, texts => {
        const guestProfile = CheckoutUtils.getGuestProfile();

        return {
            ...texts,
            guestProfile,
            getText
        };
    })
);

const witGuestSavePointsCheckbox = wrapHOC(connectedGuestSavePointsCheckbox);

export default witGuestSavePointsCheckbox(GuestSavePointsCheckbox);
