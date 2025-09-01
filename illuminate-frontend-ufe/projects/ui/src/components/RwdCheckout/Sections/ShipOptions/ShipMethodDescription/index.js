import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import Actions from 'Actions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import ShipMethodDescription from 'components/RwdCheckout/Sections/ShipOptions/ShipMethodDescription/ShipMethodDescription';
import withGlobalModals from 'hocs/withGlobalModals';
import { withSplitEDDProps } from 'viewModel/sharedComponents/splitEDD/withSplitEDDProps';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/DeliveryInfo/AutoReplenishment/locales', 'AutoReplenishment');

const localization = createStructuredSelector({
    autoReplenish: getTextFromResource(getText, 'autoReplenish'),
    subscriptionFreeShipping: getTextFromResource(getText, 'subscriptionFreeShipping'),
    freeStandardShipping: getTextFromResource(getText, 'freeStandardShipping')
});

const fields = createSelector(localization, locale => {
    return {
        locale
    };
});

const functions = {
    showMediaModal: Actions.showMediaModal
};

const withShipMethodDescriptionProps = wrapHOC(connect(fields, functions));

export default withGlobalModals(withShipMethodDescriptionProps(withSplitEDDProps(ShipMethodDescription)));
