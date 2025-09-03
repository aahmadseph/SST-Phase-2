import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import ShippingCalculationInfoMessage from 'components/RwdCheckout/Shared/ShippingCalculationInfoMessage/ShippingCalculationInfoMessage';
import localStorageConstants from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';

const { USER_HAS_SEEN_UPDATED_SHIPPING_CALCULATIONS: userHasSeenUpdatedShippingKey } = localStorageConstants;
const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/Shared/ShippingCalculationInfoMessage/locales', 'ShippingCalculationInfoMessage');

const textResources = createStructuredSelector({
    updatedShippingCalculations: getTextFromResource(getText, 'updatedShippingCalculations'),
    gotIt: getTextFromResource(getText, 'gotIt')
});

const seeUpdatedShippingKey = (value = true) => {
    Storage.local.setItem(userHasSeenUpdatedShippingKey, value);
};

const connectedShippingCalculationInfoMessage = connect(
    createSelector(textResources, texts => {
        const showUpdatedShippingCalculations = !Storage.local.getItem(userHasSeenUpdatedShippingKey);

        return {
            ...texts,
            showUpdatedShippingCalculations,
            setLocalItem: seeUpdatedShippingKey
        };
    })
);

const withShippingCalculationInfoMessageProps = wrapHOC(connectedShippingCalculationInfoMessage);

export default withShippingCalculationInfoMessageProps(ShippingCalculationInfoMessage);
