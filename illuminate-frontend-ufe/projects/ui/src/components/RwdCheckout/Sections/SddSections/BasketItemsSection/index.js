import BasketItemsSection from 'components/RwdCheckout/Sections/SddSections/BasketItemsSection/BasketItemsSection';
import withGlobalModals from 'hocs/withGlobalModals';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getAutoReplenText = getLocaleResourceFile('components/DeliveryInfo/AutoReplenishment/locales', 'AutoReplenishment');

const textResources = createStructuredSelector({
    autoReplenish: getTextFromResource(getAutoReplenText, 'autoReplenish'),
    subscriptionFreeShipping: getTextFromResource(getAutoReplenText, 'subscriptionFreeShipping'),
    freeStandardShipping: getTextFromResource(getAutoReplenText, 'freeStandardShipping')
});

const connectedBastketItems = connect(
    createSelector(textResources, texts => {
        return texts;
    })
);

const withConnectedBastkeProps = wrapHOC(connectedBastketItems);

export default withConnectedBastkeProps(withGlobalModals(BasketItemsSection));
