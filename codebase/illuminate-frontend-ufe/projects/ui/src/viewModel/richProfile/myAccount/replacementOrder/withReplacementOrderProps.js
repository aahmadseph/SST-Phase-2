import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import { replaceOrderAddressListSelector } from 'viewModel/selectors/order/replaceOrderAddressListSelector';
import samplesSelector from 'selectors/samples/samplesSelector';
import ReplacementOrderActions from 'actions/ReplacementOrderActions';
import ShipAddressActions from 'actions/ShipAddressActions';
import SampleActions from 'actions/SampleActions';
import Actions from 'Actions';
import orderUtils from 'utils/Order';
import dateUtils from 'utils/Date';
import localeUtils from 'utils/LanguageLocale';
import skuUtils from 'utils/Sku';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = localeUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/ReplacementOrder/locales', 'ReplacementOrder');

const fields = createSelector(
    orderDetailsSelector,
    replaceOrderAddressListSelector,
    samplesSelector,
    createStructuredSelector({
        mainTitle: getTextFromResource(getText, 'mainTitle'),
        shippingAddressTitle: getTextFromResource(getText, 'shippingAddressTitle'),
        deliveryTitle: getTextFromResource(getText, 'deliveryTitle'),
        itemsTitle: getTextFromResource(getText, 'itemsTitle'),
        orderSubtotalPlusTax: getTextFromResource(getText, 'orderSubtotalPlusTax'),
        oneTimeReplacement: getTextFromResource(getText, 'oneTimeReplacement'),
        shippingAndHandling: getTextFromResource(getText, 'shippingAndHandling'),
        orderTotal: getTextFromResource(getText, 'orderTotal'),
        selectSamplesText: getTextFromResource(getText, 'selectSamplesText')
    }),
    (orderDetails, replaceOrderAddressList, samples, textResources) => {
        const orderId = ReplacementOrderActions.getQueryParam('orderId');
        const hardGoodShippingGroup = orderUtils.getHardGoodShippingGroup(orderDetails);
        const orderPromiseDate = hardGoodShippingGroup?.shippingMethod?.promiseDate;
        const deliveryDateString =
            orderPromiseDate !== undefined && orderPromiseDate.length
                ? `${hardGoodShippingGroup.shippingMethod.promiseDateLabel} ${dateUtils.getPromiseDate(orderPromiseDate)}`
                : hardGoodShippingGroup?.shippingMethod?.shippingMethodDescription;
        const isCanada = localeUtils.isCanada();
        const { MAX_SAMPLES_ALLOWED } = ReplacementOrderActions;
        const isOrderExpired = orderUtils.isOrderExpired(orderDetails);
        const samplesInOrder = orderUtils.getItemsByType(skuUtils.skuTypes.SAMPLE);
        const orderItemsWithoutSamples = orderUtils.getOrderItemsWithoutSamples(orderDetails);

        return {
            ...textResources,
            orderDetails,
            addressList: replaceOrderAddressList,
            orderId,
            hardGoodShippingGroup,
            deliveryDateString,
            isCanada,
            samples,
            MAX_SAMPLES_ALLOWED,
            isOrderExpired,
            samplesInOrder,
            orderItemsWithoutSamples
        };
    }
);

const functions = {
    getReplacementOrderDetails: ReplacementOrderActions.getReplacementOrderDetails,
    getAddressBook: ShipAddressActions.getAddressBook,
    createIRorNCR: ReplacementOrderActions.createIRorNCR,
    submitReplacementOrder: ReplacementOrderActions.submitReplacementOrder,
    showMediaModal: Actions.showMediaModal,
    showSampleModal: Actions.showSampleModal,
    fetchSamples: SampleActions.fetchSamples,
    addRemoveSample: ReplacementOrderActions.addRemoveSample,
    showSessionExpiredModal: ReplacementOrderActions.showSessionExpiredModal,
    updateNcrShippingAddress: ReplacementOrderActions.updateNcrShippingAddress
};

const withReplacementOrderProps = wrapHOC(connect(fields, functions));

export {
    withReplacementOrderProps, fields, functions
};
