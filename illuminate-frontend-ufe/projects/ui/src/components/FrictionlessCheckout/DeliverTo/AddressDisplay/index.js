import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import AddressDisplay from 'components/FrictionlessCheckout/DeliverTo/AddressDisplay/AddressDisplay';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/FrictionlessCheckout/DeliverTo/AddressDisplay/locales', 'AddressDisplay');

const localizationSelector = createStructuredSelector({
    edit: getTextFromResource(getText, 'edit'),
    changeShippingAddress: getTextFromResource(getText, 'changeShippingAddress')
});

const fields = createSelector(localizationSelector, localization => {
    return {
        localization
    };
});

const withComponentProps = wrapHOC(connect(fields, null));

export default withComponentProps(AddressDisplay);
