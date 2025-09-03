import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import UserSubscriptionsSelector from 'selectors/user/userSubscriptions/userSubscriptionsSelector';
import SameDayAvailabilityStatusSelector from 'selectors/page/product/currentSku/actionFlags/sameDayAvailabilityStatusSelector';
import SameDayDeliveryMessageSelector from 'selectors/page/product/currentSku/sameDayDeliveryMessageSelector';
import PreferredZipCodeSelector from 'selectors/user/preferredZipCodeSelector';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import ExtraProductDetailsUtils from 'utils/ExtraProductDetailsUtils';

const { wrapHOC } = FrameworkUtils;
const { preferredZipCodeSelector } = PreferredZipCodeSelector;
const { userSubscriptionsSelector } = UserSubscriptionsSelector;
const { sameDayDeliveryMessageSelector } = SameDayDeliveryMessageSelector;
const { sameDayAvailabilityStatusSelector } = SameDayAvailabilityStatusSelector;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/ProductPage/DeliveryOptions/SDUBanner/locales', 'SDUBanner');

const fields = createSelector(
    userSubscriptionsSelector,
    sameDayAvailabilityStatusSelector,
    preferredZipCodeSelector,
    sameDayDeliveryMessageSelector,
    (_state, ownProps) => ownProps.isSDUAddedToBasket,
    (_state, ownProps) => ownProps.skuTrialEligibility,
    (_state, ownProps) => ownProps.skuTrialPeriod,
    createStructuredSelector({
        noTrialBannerContent: createStructuredSelector({
            title: getTextFromResource(getText, 'getFreeSameDayDelivery'),
            text: getTextFromResource(getText, 'startSavingWithSephora'),
            boldText: getTextFromResource(getText, 'sameDayUnlimited'),
            linkText: getTextFromResource(getText, 'signUp')
        }),
        noTrialInBasketBannerContent: createStructuredSelector({
            title: getTextFromResource(getText, 'youGetFreeSameDayDelivery'),
            text: getTextFromResource(getText, 'yourBasketContains'),
            boldText: getTextFromResource(getText, 'sameDayUnlimited'),
            ending: getTextFromResource(getText, 'subscription'),
            linkText: getTextFromResource(getText, 'learnMore')
        }),
        trialBannerContent: createStructuredSelector({
            title: getTextFromResource(getText, 'getFreeSameDayDelivery'),
            text: getTextFromResource(getText, 'startSavingWithA'),
            boldText: getTextFromResource(getText, 'free'),
            boldTextDayTrial: getTextFromResource(getText, 'dayTrial'),
            ending: getTextFromResource(getText, 'ofSephoraSDU'),
            linkText: getTextFromResource(getText, 'signUp'),
            tryNowForFreeText: getTextFromResource(getText, 'tryNowForFree')
        }),
        sduBannerContent: createStructuredSelector({
            title: getTextFromResource(getText, 'youGetFreeSameDayDelivery'),
            text: getTextFromResource(getText, 'yourBasketContains'),
            boldText: getTextFromResource(getText, 'free'),
            boldTextDayTrial: getTextFromResource(getText, 'dayTrial'),
            ending: getTextFromResource(getText, 'ofSameDayUnlimited'),
            linkText: getTextFromResource(getText, 'learnMore')
        })
    }),
    (
        userSubscriptions,
        sameDayAvailabilityStatus,
        zipCode,
        sameDayDeliveryMessage,
        isSDUAddedToBasket,
        skuTrialEligibility,
        skuTrialPeriod,
        textResources
    ) => {
        const { isSamedayUnlimitedEnabled } = Sephora.configurationSettings;
        const sduSubscriptions = userSubscriptions?.filter(subscription => subscription.type === 'SDU');
        const subscriptionStatus = sduSubscriptions[0]?.status;
        const isUserTrialEligible = sduSubscriptions[0]?.isTrialEligible && skuTrialEligibility;
        const isAnonymousUser = !sduSubscriptions[0];
        const isOutOfStock = ExtraProductDetailsUtils.isOutOfStock(sameDayAvailabilityStatus);
        const isBannerVisible = Boolean(zipCode && !isOutOfStock && sameDayDeliveryMessage);

        // if (subscriptionStatus === 'ACTIVE' || !skuTrialEligibility)
        if (subscriptionStatus === 'ACTIVE' || !isSamedayUnlimitedEnabled) {
            return {};
        } else if (!isUserTrialEligible && isSDUAddedToBasket && !isAnonymousUser) {
            // SDU subsription in basket (not the trial)
            return { ...textResources.noTrialInBasketBannerContent, skuTrialPeriod: null, isBannerVisible };
        } else if ((isUserTrialEligible || isAnonymousUser) && isSDUAddedToBasket) {
            // Trial added to basket
            return { ...textResources.sduBannerContent, skuTrialPeriod: skuTrialPeriod, isBannerVisible };
        } else if ((isUserTrialEligible && !isSDUAddedToBasket) || isAnonymousUser) {
            // trial eligible, NOT in basket
            return { ...textResources.trialBannerContent, skuTrialPeriod: skuTrialPeriod, isBannerVisible, showButtonCta: true };
        } else {
            // not eligible and NOT in basket
            return { ...textResources.noTrialBannerContent, skuTrialPeriod: null, isBannerVisible };
        }
    }
);

const withSDUBannerProps = wrapHOC(connect(fields));

export {
    withSDUBannerProps, fields
};
