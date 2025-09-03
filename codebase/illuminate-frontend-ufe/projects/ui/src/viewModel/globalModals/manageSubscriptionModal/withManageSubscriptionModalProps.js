import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import DeliveryFrequencyUtils from 'utils/DeliveryFrequency';
import { localeSelector } from 'viewModel/selectors/locale/localeSelector';
import ShippingAndPaymentInfoSelector from 'selectors/page/autoReplenishment/shippingAndPaymentInfo/shippingAndPaymentInfoSelector';
import { userSelector } from 'selectors/user/userSelector';
import FrameworkUtils from 'utils/framework';
import autoReplenishmentActions from 'actions/AutoReplenishmentActions';
import AutoReplenishmentBindings from 'analytics/bindingMethods/pages/myAccount/AutoReplenishmentBindings';
import LanguageLocale from 'utils/LanguageLocale';
import OrderUtils from 'utils/Order';

const { formatFrequencyType } = DeliveryFrequencyUtils;
const { wrapHOC } = FrameworkUtils;
const { shippingAndPaymentInfoSelector } = ShippingAndPaymentInfoSelector;
const getText = LanguageLocale.getLocaleResourceFile('components/GlobalModals/ManageSubscriptionModal/locales', 'ManageSubscriptionModal');

const fields = createSelector(
    shippingAndPaymentInfoSelector,
    userSelector,
    (_state, ownProps) => ownProps.subscription,
    (_state, ownProps) => ownProps.currentSubscriptionPaymentInfo,
    localeSelector,
    (shippingAndPaymentData, user, subscription, currentSubscriptionPaymentInfo) => {
        const manageSubscription = getText('manageSubscription');
        const qty = getText('qty');
        const deliveryEvery = getText('deliveryEvery');
        const shippingAddressText = getText('shippingAddress');
        const paymentMethodText = getText('paymentMethod');
        const skip = getText('skip');
        const pause = getText('pause');
        const itemText = getText('item', ['{0}']);
        const askToUpdateDelivery = getText('askToUpdateDelivery');

        const { frequency, frequencyType, items } = subscription;
        const tabHeadingText = `${deliveryEvery}: ${frequency} ${formatFrequencyType(frequency, frequencyType)}`;
        const showUpdateDeliveryMessage = frequency > 1;
        const { payment, shippingAddress } = shippingAndPaymentData;
        const {
            address1: address, city, state, zipcode, postalCode, phoneNumber
        } = shippingAddress || {};
        const fullAddress = `${city}, ${state} ${zipcode || postalCode}`;
        const { cardTokenNumber, cardType = '' } = payment || {};
        const item = items && items[0];
        const displayItemVariation = item.variationType && item.variationValue && item.skuId;
        const itemQuantityText = `${qty} : ${item.qty}`;
        const fullName = `${user.firstName} ${user.lastName}`;
        const logoFileName = OrderUtils.getThirdPartyCreditCard({ cardType }) || 'placeholder';
        const {
            enableReplenishmentAddressModifiable = false,
            enableReplenishmentFrequencyModifiable = false,
            enableReplenishmentPaymentModifiable = false,
            enableReplenishmentOperations = false
        } = Sephora.configurationSettings.autoReplenishmentConfigurations || {};
        const currentCardInfo = Object.keys(currentSubscriptionPaymentInfo).length > 0;
        const creditCardLogo = `/img/ufe/payments/${currentCardInfo ? currentSubscriptionPaymentInfo.logoFileName : logoFileName}.svg`;
        const creditCardName = currentCardInfo ? currentSubscriptionPaymentInfo.cardType : cardType;
        const creditCardToken = currentCardInfo ? currentSubscriptionPaymentInfo.cardNumber : cardTokenNumber;
        const creditCard = `${creditCardName} *${creditCardToken}`;

        return {
            address,
            cardTokenNumber,
            cardType,
            creditCard,
            creditCardLogo,
            displayItemVariation,
            enableReplenishmentAddressModifiable,
            enableReplenishmentFrequencyModifiable,
            enableReplenishmentOperations,
            enableReplenishmentPaymentModifiable,
            fullAddress,
            fullName,
            item,
            itemQuantityText,
            itemText,
            logoFileName,
            manageSubscription,
            pause,
            paymentMethodText,
            phoneNumber,
            shippingAddressText,
            skip,
            tabHeadingText,
            askToUpdateDelivery,
            showUpdateDeliveryMessage
        };
    }
);

const functions = (dispatch, ownProps) => ({
    loadShippingAndPaymentInfo: async () => {
        const {
            fireGenericErrorAnalytics,
            onDismiss,
            subscription: { paymentId, profileId, shippingAddressId }
        } = ownProps;
        const action = autoReplenishmentActions.loadShippingAndPaymentInfo(
            profileId,
            shippingAddressId,
            paymentId,
            onDismiss,
            fireGenericErrorAnalytics
        );
        await dispatch(action);
    },
    onModalClose: () => {
        AutoReplenishmentBindings.manageSubscriptionClose(ownProps.subscription);
        ownProps.onDismiss();
    }
});

const withManageSubscriptionModalProps = wrapHOC(connect(fields, functions));

export {
    withManageSubscriptionModalProps, functions
};
