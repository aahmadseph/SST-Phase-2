import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import DeliverTo from 'components/FrictionlessCheckout/DeliverTo/DeliverTo';
import addressListSelector from 'selectors/order/addressListSelector';
import userUtils from 'utils/User';
import { getAddressList } from 'components/FrictionlessCheckout/checkoutService/checkoutService';
import { orderSelector } from 'selectors/order/orderSelector';
import orderErrorsSelector from 'selectors/order/orderErrorsSelector';
import PreferredZipCodeSelector from 'selectors/user/preferredZipCodeSelector';
const { preferredZipCodeSelector } = PreferredZipCodeSelector;
import ShipAddressActions from 'actions/ShipAddressActions';
import Empty from 'constants/empty';
import { SECTION_NAMES } from 'constants/frictionlessCheckout';
import OrderActions from 'actions/OrderActions';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile, isCanada } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/DeliverTo/locales', 'DeliverTo');

const halOperatingHoursSelector = createSelector(orderSelector, order => order.halOperatingHours || Empty.Array);

const loadUserAddressList = () => {
    if (!userUtils.isAnonymous()) {
        const profileId = userUtils.getProfileId();
        const shipCountry = userUtils.getShippingCountry().countryCode;
        getAddressList(profileId, shipCountry);
    }
};

const localization = createStructuredSelector({
    getItShippedTitle: getTextFromResource(getText, 'gisTitle'),
    sDDAndGISOrders: getTextFromResource(getText, 'sDDAndGISOrders'),
    gISAndAROrders: getTextFromResource(getText, 'gISAndAROrders'),
    sDDAndAROrders: getTextFromResource(getText, 'sDDAndAROrders'),
    sDDAndGISAndAROrders: getTextFromResource(getText, 'sDDAndGISAndAROrders'),
    holdAtLocation: getTextFromResource(getText, isCanada() ? 'holdAtLocationCA' : 'holdAtLocation')
});

const normalizeZip = zip => (zip || '').replace(/[^0-9A-Z]/gi, '');

const filterAddressByPreferredZipCode = (preferredZipCode, addressList) => {
    const sliceNumber = isCanada() ? 3 : 5;
    const normPref = normalizeZip(preferredZipCode).slice(0, sliceNumber);

    return addressList.filter(address => {
        const normAddr = normalizeZip(address.postalCode).slice(0, sliceNumber);

        return normPref === normAddr;
    }).length;
};

const fields = createSelector(
    localization,
    addressListSelector,
    halOperatingHoursSelector,
    preferredZipCodeSelector,
    orderErrorsSelector,
    (_ownState, ownProps) => ownProps.isSdd,
    (locale, addressList, halOperatingHours, preferredZipCode, sectionErrors, isSdd) => {
        return {
            localization: locale,
            addressList,
            halOperatingHours,
            ...(isSdd && { addressByPreferredZipCode: filterAddressByPreferredZipCode(preferredZipCode, addressList) }),
            sectionLevelError: sectionErrors?.[SECTION_NAMES.DELIVER_TO]?.length && sectionErrors?.[SECTION_NAMES.DELIVER_TO],
            sectionName: SECTION_NAMES.DELIVER_TO
        };
    }
);

const utilityFunctions = {
    loadUserAddressList,
    getAddressBook: ShipAddressActions.getAddressBook,
    setActiveSection: OrderActions.setCheckoutActiveSection
};

const withDeliverToProps = wrapHOC(
    connect(fields, null, (stateProps, dispatchProps, ownProps) => ({
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        ...utilityFunctions
    }))
);

export default withDeliverToProps(DeliverTo);
