import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import ShipMethodsList from 'components/RwdCheckout/Sections/ShipOptions/ShipMethodsList/ShipMethodsList';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/Sections/ShipOptions/locales', 'ShipOptions');

const localization = createStructuredSelector({
    moreDeliveryOptions: getTextFromResource(getText, 'moreDeliveryOptions')
});

const fields = createSelector(localization, locale => {
    return {
        locale
    };
});

const functions = null;

const withShipMethodsListProps = wrapHOC(connect(fields, functions));

export default withShipMethodsListProps(ShipMethodsList);
