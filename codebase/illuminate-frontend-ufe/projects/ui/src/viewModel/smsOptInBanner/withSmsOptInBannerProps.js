import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import urlUtils from 'utils/Url';
import userUtils from 'utils/User';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { redirectTo } = urlUtils;

const getText = getLocaleResourceFile('components/SmsOptInBanner/locales', 'SmsOptInBanner');

const localization = createStructuredSelector({
    bannerParagraph: getTextFromResource(getText, 'bannerParagraph'),
    bannerRates: getTextFromResource(getText, 'bannerRates'),
    bannerButton: getTextFromResource(getText, 'bannerButton'),
    bannerTitle: getTextFromResource(getText, 'bannerTitle')
});

const fields = createSelector(userSelector, localization, (user, textResources) => {
    // Check if the user is eligible for SMS opt-in banner.
    const isSMSOptInAvailable = user?.smsStatus?.isSMSOptInAvailable;
    const isUserOptedIn = user?.smsStatus?.isUserOptedIn;

    // Checks if the SMS opt-in is available and the user has not already opted in.
    const smsOptInStatus = isSMSOptInAvailable && !isUserOptedIn;

    const isBI = userUtils.isBI();
    const shouldDisplayBanner = smsOptInStatus && isBI;
    const imgSrc = '/img/ufe/store/sms-evergreen-banner.svg';
    const handleRedirect = originParam => {
        redirectTo(`/beauty/text-alerts${originParam ? `?origin=${originParam}` : ''}`);
    };

    return {
        shouldDisplayBanner,
        imgSrc,
        handleRedirect,
        localization: textResources
    };
});

const withSmsOptInBannerProps = wrapHOC(connect(fields));

export {
    fields, localization, withSmsOptInBannerProps
};
