import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import Actions from 'Actions';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/GlobalModals/SignInWithMessagingModal/GuestBookingMessaging/locales', 'GuestBookingMessaging');

const localization = createStructuredSelector({
    createAccountBookingMessage: getTextFromResource(getText, 'createAccountBookingMessage'),
    bankYourBeautyPointsFree: getTextFromResource(getText, 'bankYourBeautyPointsFree', ['{0}']),
    freeBirthdayGift: getTextFromResource(getText, 'freeBirthdayGift'),
    seasonalSavingsEvents: getTextFromResource(getText, 'seasonalSavingsEvents'),
    freeShipping: getTextFromResource(getText, 'freeShipping'),
    createAccountButton: getTextFromResource(getText, 'createAccountButton'),
    bookingAsAGuestButton: getTextFromResource(getText, 'bookingAsAGuestButton')
});

const fields = createStructuredSelector({
    localization
});

const functions = {
    showSignInWithMessagingModal: Actions.showSignInWithMessagingModal,
    showRegisterModal: Actions.showRegisterModal
};

const withGuestBookingMessagingProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withGuestBookingMessagingProps
};
