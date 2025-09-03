import { ERROR_TYPES } from 'constants/targetedLandingPromotionConstants.js';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import actions from 'actions/Actions';
import Location from 'utils/Location';
import urlUtils from 'utils/Url';
import { HEADER_VALUE } from 'constants/authentication';

const { showSignInModal } = actions;
const BEAUTY_OFFERS_LINK = urlUtils.getLink('/beauty/beauty-offers');
const getText = localeUtils.getLocaleResourceFile('utils/locales/TargetedLandingPromotion', 'TargetedLandingPromotion');

const ERROR_TYPE_DATA = {
    [ERROR_TYPES.ANONYMOUS]: {
        mainHeading: getText('anonymousHeading'),
        bodyText: getText('anonymousText'),
        buttonText: getText('anonymousButtonText'),
        onClickCTA: () => {
            store.dispatch(showSignInModal({ isOpen: true, extraParams: { headerValue: HEADER_VALUE.USER_CLICK } }));
        }
    },
    [ERROR_TYPES.PROMOTION_NOT_ACTIVE]: {
        mainHeading: getText('expiredHeading'),
        bodyText: getText('expiredText'),
        buttonText: getText('exploreNowButton'),
        onClickCTA: () => {
            Location.navigateTo(null, BEAUTY_OFFERS_LINK);
        }
    },
    [ERROR_TYPES.CUSTOMER_IS_NOT_IN_SEGMENT]: {
        mainHeading: getText('unqualifiedHeading'),
        bodyText: getText('unqualifiedText'),
        buttonText: getText('exploreNowButton'),
        onClickCTA: () => {
            Location.navigateTo(null, BEAUTY_OFFERS_LINK);
        }
    },
    [ERROR_TYPES.PROMOTION_NOT_FOUND]: {
        mainHeading: getText('apiFailedHeading'),
        bodyText: getText('apiFailedText'),
        buttonText: getText('apiFailedButton'),
        onClickCTA: () => {
            Location.navigateTo(null, urlUtils.getLink('/'));
        }
    }
};

export { ERROR_TYPE_DATA };
