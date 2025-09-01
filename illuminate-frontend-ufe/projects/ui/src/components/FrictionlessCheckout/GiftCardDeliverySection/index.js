import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import GiftCardDeliverySection from 'components/FrictionlessCheckout/GiftCardDeliverySection/GiftCardDeliverySection';
import addressListSelector from 'selectors/order/addressListSelector';
import userUtils from 'utils/User';
import { getAddressList } from 'components/FrictionlessCheckout/checkoutService/checkoutService';
import PreferredZipCodeSelector from 'selectors/user/preferredZipCodeSelector';
const { preferredZipCodeSelector } = PreferredZipCodeSelector;
import ShipAddressActions from 'actions/ShipAddressActions';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/GiftCardDeliverySection/locales', 'GiftCardDeliverySection');

const loadUserAddressList = () => {
    if (!userUtils.isAnonymous()) {
        const profileId = userUtils.getProfileId();
        const shipCountry = userUtils.getShippingCountry().countryCode;
        getAddressList(profileId, shipCountry);
    }
};

const localization = createStructuredSelector({
    giftCardTitle: getTextFromResource(getText, 'giftCardTitle'),
    free: getTextFromResource(getText, 'free')
});

const fields = createSelector(
    localization,
    addressListSelector,
    preferredZipCodeSelector,
    (_ownState, ownProps) => ownProps.isSdd,
    (locale, addressList) => {
        return {
            localization: locale,
            addressList
        };
    }
);

const utilityFunctions = {
    loadUserAddressList,
    getAddressBook: ShipAddressActions.getAddressBook
};

const withGiftCardDeliverySectionProps = wrapHOC(
    connect(fields, null, (stateProps, dispatchProps, ownProps) => ({
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        ...utilityFunctions
    }))
);

export default withGiftCardDeliverySectionProps(GiftCardDeliverySection);
