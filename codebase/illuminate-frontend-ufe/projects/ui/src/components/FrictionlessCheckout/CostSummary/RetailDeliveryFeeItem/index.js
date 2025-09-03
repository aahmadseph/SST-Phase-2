import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import RetailDeliveryFeeItem from 'components/FrictionlessCheckout/CostSummary/RetailDeliveryFeeItem/RetailDeliveryFeeItem';
import withGlobalModals from 'hocs/withGlobalModals';

import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import OrderUtils from 'utils/Order';
import Actions from 'actions/Actions';
import BCC from 'utils/BCC';

const { getRDF } = OrderUtils;
const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const { showMediaModal } = Actions;
const { RETAIL_DELIVERY_FEE_MODAL } = BCC.MEDIA_IDS;

const getText = getLocaleResourceFile('components/SharedComponents/RetailDeliveryFeeItem/locales', 'RetailDeliveryFeeItem');

const fields = createSelector(
    createStructuredSelector({
        defaultText: getTextFromResource(getText, 'defaultText'),
        qty: (state, ownProps) => {
            const feesAsArray = state.order?.orderDetails?.priceInfo?.fees;
            const priceInfo = ownProps.priceInfo;
            const isCheckout = ownProps.isCheckout;
            const isOrderConfirmation = ownProps.isOrderConfirmation;
            const orderDetails = state.order?.orderDetails;
            const feeAmount = getRDF({
                feesAsArray,
                priceInfo,
                orderDetails,
                isCheckout,
                isOrderConfirmation
            });
            let qtyText = feeAmount;

            if (isCheckout && !feeAmount) {
                qtyText = getTextFromResource(getText, 'qtyTbd')(state);
            }

            return qtyText;
        },
        visible: (state, ownProps) => {
            const hasShippingGroups = state.order?.orderDetails?.shippingGroups?.shippingGroupsEntries?.length;

            if (!hasShippingGroups) {
                return false;
            }

            const shippingGroupAddress = state.order?.orderDetails?.shippingGroups?.shippingGroupsEntries[0]?.shippingGroup?.address || {};
            const { postalCode: shippingPostalCode = '', state: shippingState = '' } = shippingGroupAddress;
            const feesAsArray = state.order?.orderDetails?.priceInfo?.fees;
            const priceInfo = ownProps.priceInfo;
            const isCheckout = ownProps.isCheckout;
            const isOrderConfirmation = ownProps.isOrderConfirmation;
            const orderDetails = state.order?.orderDetails;
            const feeAmount = getRDF({
                feesAsArray,
                priceInfo,
                orderDetails,
                isCheckout,
                isOrderConfirmation
            });

            return Boolean(shippingPostalCode !== '' && shippingState !== '' && feeAmount);
        },
        mediaModalTitle: getTextFromResource(getText, 'retailDeliveryModalTitle')
    }),
    ({ defaultText, qty, visible, mediaModalTitle }) => {
        const newProps = {
            defaultText,
            qty,
            visible,
            mediaModalTitle,
            RETAIL_DELIVERY_FEE_MODAL
        };

        return newProps;
    }
);

const functions = { showMediaModal };

const withRetailDeliveryFeeItemProps = wrapHOC(connect(fields, functions));

const WrappedRetailDeliveryFeeItem = withGlobalModals(withRetailDeliveryFeeItemProps(RetailDeliveryFeeItem));

export default WrappedRetailDeliveryFeeItem;
