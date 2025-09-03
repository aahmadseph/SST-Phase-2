import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import ShipAddressSection from 'components/RwdCheckout/Sections/ShipAddress/Section/ShipAddressSection';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/Sections/ShipAddress/locales', 'ShipAddress');

const textResources = createStructuredSelector({
    removeAddressLabel: getTextFromResource(getText, 'removeAddressLabel'),
    remove: getTextFromResource(getText, 'remove'),
    editAddressLabel: getTextFromResource(getText, 'editAddressLabel'),
    edit: getTextFromResource(getText, 'edit'),
    addShippingAddress: getTextFromResource(getText, 'addShippingAddress'),
    showMoreAddresses: getTextFromResource(getText, 'showMoreAddresses'),
    showLessAddresses: getTextFromResource(getText, 'showLessAddresses'),
    deliveryMethod: getTextFromResource(getText, 'deliveryMethod'),
    setAsDefaultCheckbox: getTextFromResource(getText, 'setAsDefaultCheckbox'),
    editShipAddress: getTextFromResource(getText, 'editShipAddress'),
    addNewShipAddress: getTextFromResource(getText, 'addNewShipAddress'),
    cancelButton: getTextFromResource(getText, 'cancelButton'),
    saveContinueButton: getTextFromResource(getText, 'saveContinueButton'),
    continueButton: getTextFromResource(getText, 'continueButton'),
    areYouSureMessage: getTextFromResource(getText, 'areYouSureMessage'),
    taxExemptAddressLabel: getTextFromResource(getText, 'taxExemptAddressLabel')
});

const connectedShipAddress = connect(
    createSelector(textResources, texts => {
        return {
            ...texts,
            getText
        };
    })
);

const withComponentProps = wrapHOC(connectedShipAddress);

export default withComponentProps(ShipAddressSection);
