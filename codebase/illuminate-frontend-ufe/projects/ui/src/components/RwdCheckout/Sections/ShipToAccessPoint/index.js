import ShipToAccessPoint from 'components/RwdCheckout/Sections/ShipToAccessPoint/ShipToAccessPoint';
import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';

import { userSelector } from 'selectors/user/userSelector';
import { orderSelector } from 'selectors/order/orderSelector';
import OrderActions from 'actions/OrderActions';
import AddressActions from 'actions/AddressActions';
import localeUtils from 'utils/LanguageLocale';
import { getLocationHoursText } from 'utils/AccessPoints';
import decorators from 'utils/decorators';
import checkoutApi from 'services/api/checkout';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import ErrorsUtils from 'utils/Errors';
import store from 'store/Store';
import Location from 'utils/Location';

const { getTextFromResource, getLocaleResourceFile, isCanada } = localeUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/Sections/ShipToAccessPoint/locales', 'ShipToAccessPoint');

const createShippingAddress = (halAddressPayload, currentHalAddress, comp) => {
    decorators
        .withInterstice(
            checkoutApi.createShippingAddress,
            INTERSTICE_DELAY_MS
        )(halAddressPayload)
        .then(() => {
            store.dispatch(OrderActions.sectionSaved(Location.getLocation().pathname, comp));
            store.dispatch(OrderActions.updateCurrentHalAddress(currentHalAddress));

            processEvent.process(anaConsts.ADD_SHIPPINGINFO_EVENT, {
                data: {}
            });
        })
        .catch(errorData => {
            ErrorsUtils.collectAndValidateBackEndErrors(errorData, comp);
        });
};

const localization = createStructuredSelector({
    pickupPerson: getTextFromResource(getText, 'pickupPerson'),
    idRequired: getTextFromResource(getText, isCanada() ? 'idRequiredCA' : 'idRequired'),
    firstName: getTextFromResource(getText, 'firstName'),
    lastName: getTextFromResource(getText, 'lastName'),
    email: getTextFromResource(getText, 'email'),
    emailRequiredText: getTextFromResource(getText, 'emailRequiredText'),
    phoneNumber: getTextFromResource(getText, 'phoneNumber'),
    streetAddress: getTextFromResource(getText, 'streetAddress'),
    addressLine2: getTextFromResource(getText, 'addressLine2'),
    postalCode: getTextFromResource(getText, 'postalCode'),
    invalidPostalCode: getTextFromResource(getText, 'invalidPostalCode'),
    enterPostalCode: getTextFromResource(getText, 'enterPostalCode'),
    city: getTextFromResource(getText, 'city'),
    province: getTextFromResource(getText, 'province'),
    shipToAddress: getTextFromResource(getText, 'shipToAddress')
});

const dataSelector = createStructuredSelector({
    user: userSelector,
    order: orderSelector,
    localization
});

const withShipToAccessPointProps = connect(
    createSelector(dataSelector, data => {
        return {
            ...data,
            createShippingAddress,
            getLocationHoursText
        };
    }),
    {
        getStateList: AddressActions.getStateList
    }
);

const ConnectedShipToAccessPoint = withShipToAccessPointProps(ShipToAccessPoint);
ConnectedShipToAccessPoint.displayName = 'ConnectedShipToAccessPoint';

export default ConnectedShipToAccessPoint;
