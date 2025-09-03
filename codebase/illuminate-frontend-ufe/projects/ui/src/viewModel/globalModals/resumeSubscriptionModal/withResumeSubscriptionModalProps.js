import { connect } from 'react-redux';
import { userSelector } from 'selectors/user/userSelector';
import ShippingAndPaymentInfoSelector from 'selectors/page/autoReplenishment/shippingAndPaymentInfo/shippingAndPaymentInfoSelector';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import AutoReplenishmentActions from 'actions/AutoReplenishmentActions';
import AutoReplenishmentBindings from 'analytics/bindingMethods/pages/myAccount/AutoReplenishmentBindings';
import FrameworkUtils from 'utils/framework';
import dateUtils from 'utils/Date';
import StringUtils from 'utils/String';

const { wrapHOC } = FrameworkUtils;
const { shippingAndPaymentInfoSelector } = ShippingAndPaymentInfoSelector;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/ResumeSubscriptionModal/locales', 'ResumeSubscriptionModal');

const fields = createSelector(
    (_state, ownProps) => ownProps.item,
    userSelector,
    shippingAndPaymentInfoSelector,
    createStructuredSelector({
        resumeSubscription: getTextFromResource(getText, 'resumeSubscription'),
        qty: getTextFromResource(getText, 'qty'),
        deliveryEvery: getTextFromResource(getText, 'deliveryEvery'),
        shippingAddress: getTextFromResource(getText, 'shippingAddress'),
        paymentMethod: getTextFromResource(getText, 'paymentMethod'),
        nextShipment: getTextFromResource(getText, 'nextShipment'),
        resume: getTextFromResource(getText, 'resume'),
        cancel: getTextFromResource(getText, 'cancel'),
        editMessage: getTextFromResource(getText, 'editMessage'),
        paymentMessage: getTextFromResource(getText, 'paymentMessage'),
        itemText: getTextFromResource(getText, 'item'),
        notRated: getTextFromResource(getText, 'notRated'),
        oneReview: getTextFromResource(getText, 'oneReview'),
        yearlySavings: getTextFromResource(getText, 'yearlySavings'),
        firstYearSavings: getTextFromResource(getText, 'firstYearSavings'),
        lastDeliveryLeft: getTextFromResource(getText, 'lastDeliveryLeft', ['{0}']),
        deliveriesLeft: getTextFromResource(getText, 'deliveriesLeft', ['{0}']),
        discountValidUntil: getTextFromResource(getText, 'discountValidUntil', ['{0}']),
        discountsValidUntil: getTextFromResource(getText, 'discountsValidUntil', ['{0}'])
    }),
    (item, user, shippingAndPaymentData, textResources) => {
        const profileId = user.profileId;
        const fullName = `${user.firstName} ${user.lastName}`;
        const { payment, shippingAddress } = shippingAndPaymentData;
        const {
            address1: address, city, state, zipcode, phoneNumber
        } = shippingAddress || {};
        const { cardTokenNumber, cardType = '' } = payment || {};

        const {
            deliveriesLeft, lastDeliveryLeft, discountValidUntil, discountsValidUntil, ...restTextResources
        } = textResources;
        const { acceleratedPromotion } = item;

        const acceleratedPromotionData = {};

        if (acceleratedPromotion) {
            const { promoExpirationDate, remainingOrderCount, discountAmount } = acceleratedPromotion;
            const promoExpiryDate = dateUtils.formatDateMDY(promoExpirationDate, true, false, true);

            acceleratedPromotionData.discountDeliveriesLeft = StringUtils.format(
                remainingOrderCount > 1 ? deliveriesLeft : lastDeliveryLeft,
                Math.ceil(discountAmount)
            );

            acceleratedPromotionData.discountsValidUntilMessage = StringUtils.format(
                remainingOrderCount > 1 ? discountsValidUntil : discountValidUntil,
                promoExpiryDate
            );
        }

        return {
            ...restTextResources,
            ...acceleratedPromotionData,
            profileId,
            fullName,
            address,
            city,
            state,
            zipcode,
            phoneNumber,
            cardTokenNumber,
            cardType
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
        const action = AutoReplenishmentActions.loadShippingAndPaymentInfo(
            profileId,
            shippingAddressId,
            paymentId,
            onDismiss,
            fireGenericErrorAnalytics
        );
        await dispatch(action);
    },
    onModalClose: () => {
        AutoReplenishmentBindings.resumeClose(ownProps.subscription);
        ownProps.onDismiss();
    }
});

const withResumeSubscriptionModalProps = wrapHOC(connect(fields, functions));

export {
    withResumeSubscriptionModalProps, fields, functions
};
