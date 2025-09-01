import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import Actions from 'Actions';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { userSelector } from 'selectors/user/userSelector';
import UserSubscriptionsSelector from 'selectors/user/userSubscriptions/userSubscriptionsSelector';
import userLocationUtils from 'utils/UserLocation';
import AddressUtils from 'utils/Address';
import userUtils from 'utils/User';
import Empty from 'constants/empty';

const { formatZipCode } = AddressUtils;
const { wrapHOC } = FrameworkUtils;
const { userSubscriptionsSelector } = UserSubscriptionsSelector;
const { getLocaleResourceFile, getTextFromResource, isUS } = LanguageLocaleUtils;

const getText = getLocaleResourceFile(
    'components/ProductPage/Type/DigitalProduct/SameDayUnlimitedLandingPage/ZipCodeLocator/locales',
    'ZipCodeLocator'
);

const fields = createSelector(
    userSelector,
    userSubscriptionsSelector,
    (_state, ownProps) => ownProps.isCanada,
    createStructuredSelector({
        SDUAvailable: getTextFromResource(getText, 'SDUAvailable'),
        SDUUnavailable: getTextFromResource(getText, 'SDUUnavailable'),
        yourLocation: getTextFromResource(getText, 'yourLocation'),
        noSephoraLocations: getTextFromResource(getText, 'noSephoraLocations'),
        checkAnotherPostalCode: getTextFromResource(getText, 'checkAnotherPostalCode'),
        checkAnotherZIP: getTextFromResource(getText, 'checkAnotherZIP'),
        tapToSeeAvailability: getTextFromResource(getText, 'tapToSeeAvailability')
    }),
    (user, userSubscriptions, isCanada, textResources) => {
        const isCA = isCanada || !isUS();
        const { preferredZipCode } = user;
        const hasPreferredZipCode = !!preferredZipCode;
        const zipCode = preferredZipCode ? formatZipCode(preferredZipCode) : textResources.yourLocation;
        const { checkAnotherZIP, checkAnotherPostalCode, ...restResources } = textResources;
        const checkOtherZipCode = isCA ? checkAnotherPostalCode : checkAnotherZIP;
        const SDUSubscription = userSubscriptions?.filter(subscription => subscription.type === 'SDU') || Empty.Array;
        const isUserSDUTrialEligible = userUtils.isAnonymous()
            ? true
            : SDUSubscription.length > 0 && SDUSubscription[0].isTrialEligible && SDUSubscription[0].status === 'INACTIVE';

        return {
            ...restResources,
            checkOtherZipCode,
            preferredZipCode,
            zipCode,
            hasPreferredZipCode,
            isUserSDUTrialEligible
        };
    }
);

const functions = {
    showShippingDeliveryLocationModal: Actions.showShippingDeliveryLocationModal,
    updatePreferredZipCode: userLocationUtils.updatePreferredZipCode
};

const withZipCodeLocatorProps = wrapHOC(connect(fields, functions));

export {
    withZipCodeLocatorProps, fields
};
