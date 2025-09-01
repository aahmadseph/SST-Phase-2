import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import RwdAddressForm from 'components/Addresses/RwdAddressForm/RwdAddressForm';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/Addresses/AddressForm/locales', 'AddressForm');

const textResources = createStructuredSelector({
    firstNameText: getTextFromResource(getText, 'firstName'),
    lastNameText: getTextFromResource(getText, 'lastName'),
    caName: getTextFromResource(getText, 'caName'),
    usName: getTextFromResource(getText, 'usName'),
    countryText: getTextFromResource(getText, 'country'),
    address2LabelText: getTextFromResource(getText, 'address2Label'),
    streetAddress: getTextFromResource(getText, 'streetAddress'),
    optional: getTextFromResource(getText, 'optional'),
    add: getTextFromResource(getText, 'add'),
    postalCode: getTextFromResource(getText, 'postalCode'),
    zipPostalCode: getTextFromResource(getText, 'zipPostalCode'),
    cityText: getTextFromResource(getText, 'city'),
    province: getTextFromResource(getText, 'province'),
    region: getTextFromResource(getText, 'region'),
    stateRegion: getTextFromResource(getText, 'stateRegion'),
    phone: getTextFromResource(getText, 'phone'),
    phoneContext: getTextFromResource(getText, 'phoneContext'),
    enterZipCodeText: getTextFromResource(getText, 'enterZipCodeText'),
    emailAddress: getTextFromResource(getText, 'emailAddress'),
    emailRequiredText: getTextFromResource(getText, 'emailRequiredText')
});

const connectedShipAddress = connect(
    createSelector(textResources, texts => {
        return {
            localization: texts
        };
    })
);

const withComponentProps = wrapHOC(connectedShipAddress);

export default withComponentProps(RwdAddressForm);
