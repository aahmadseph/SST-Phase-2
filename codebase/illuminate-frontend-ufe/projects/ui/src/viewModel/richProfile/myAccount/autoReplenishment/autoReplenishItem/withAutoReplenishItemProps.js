import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import LanguageLocale from 'utils/LanguageLocale';
import { localeSelector } from 'viewModel/selectors/locale/localeSelector';
import DeliveryFrequencyUtils from 'utils/DeliveryFrequency';
import dateUtils from 'utils/Date';
import StringUtils from 'utils/String';
import basketUtils from 'utils/Basket';
import localeUtils from 'utils/LanguageLocale';
import Actions from 'actions/Actions';

const { formatFrequencyType, formatSavingAmountString, formatCurrency } = DeliveryFrequencyUtils;
const { showInfoModal } = Actions;
const getText = LanguageLocale.getLocaleResourceFile('components/RichProfile/MyAccount/AutoReplenishment/locales', 'AutoReplenishment');

const fields = createSelector(
    (_state, ownProps) => ownProps.subscription,
    (_state, ownProps) => ownProps.item,
    (_state, ownProps) => ownProps.setCurrentSubscription,
    (_state, ownProps) => ownProps.toggleUnsubscribeAutoReplenModal,
    (_state, ownProps) => ownProps.toggleManageSubscriptionModal,
    (_state, ownProps) => ownProps.toggleModifySubscriptionErrorModal,
    (_state, ownProps) => ownProps.toggleResumeSubscriptionModal,
    localeSelector,
    (
        subscription,
        item,
        setCurrentSubscription,
        toggleUnsubscribeAutoReplenModal,
        toggleManageSubscriptionModal,
        toggleModifySubscriptionErrorModal,
        toggleResumeSubscriptionModal
    ) => {
        const isFrench = localeUtils.isFrench();
        const paused = getText('paused');
        const save = getText('save');
        const annuallyWithSubscription = getText('annuallyWithSubscription');
        const deliverEvery = getText('deliverEvery');
        const itemText = getText('item', ['{0}']);
        const nextShipment = getText('nextShipment');
        const pausedDelivery = getText('pausedDelivery');
        const resumeSubscription = getText('resumeSubscription');
        const manageSubscription = getText('manageSubscription');
        const unsubscribe = getText('unsubscribe');
        const stillSave = getText('stillSave');
        const before = getText('before');
        const autoReplenishPromoInfoModalTitle = isFrench ? 'Aubaine Autoprovision' : 'Auto-Replenish Hot Deal';
        const autoReplenishPromoInfoModalMsg1 = isFrench
            ? 'Votre réduction sur l’Aubaine Autoprovision est valable pour vos 3 premières commandes, lesquelles doivent être livrées dans les 12 mois suivant la commande initiale.'
            : 'Your Auto-Replenish Hot Deal discount is valid for your first 3 orders, delivered within 12 months after the initial order placement.';
        const autoReplenishPromoInfoModalMsg2 = getText('autoReplenishPromoInfoModalMsg2');
        const autoReplenishPromoInfoModalButton = getText('autoReplenishPromoInfoModalButton');
        const lastDeliveryLeft = getText('lastDeliveryLeft', ['{0}']);
        const deliveriesLeft = getText('deliveriesLeft', ['{0}']);
        const discountValidUntil = getText('discountValidUntil', ['{0}']);
        const discountsValidUntil = getText('discountsValidUntil', ['{0}']);
        const or = getText('or');
        const savePercentage = getText('savePercentage', ['{0}']);
        const getItBefore = getText('getItBefore');
        const { frequency, frequencyType, status, isModifiable } = subscription;
        const isPaused = status === 'PAUSED';
        const frequencyDelivery = formatFrequencyType(frequency, frequencyType);
        const displayItemVariation = item.variationType && item.variationValue && item.skuId;
        const promiseDate = isPaused || dateUtils.getPromiseDate(`${subscription.nextScheduleRunDate}T00:00`);
        const savingAmount = formatSavingAmountString(
            {
                replenishmentAdjuster: item.discountAmount,
                replenishmentAdjusterPrice: item.discountedPrice,
                replenishmentAdjusterType: item.discountType
            },
            item.qty
        );
        const listPrice = item && formatCurrency(parseFloat(basketUtils.removeCurrency(item.price)), item.qty);

        const { acceleratedPromotion } = item;
        const acceleratedPromotionData = {};

        if (acceleratedPromotion) {
            const { promoExpirationDate, remainingOrderCount, discountAmount, acceleratedDiscountReclaimPossible } = acceleratedPromotion;
            const promoExpiryDate = dateUtils.formatDateMDY(promoExpirationDate, true, false, true);

            acceleratedPromotionData.discountDeliveriesLeft = StringUtils.format(
                remainingOrderCount > 1 ? deliveriesLeft : lastDeliveryLeft,
                Math.ceil(discountAmount)
            );

            acceleratedPromotionData.discountsValidUntilMessage = StringUtils.format(
                remainingOrderCount > 1 ? discountsValidUntil : discountValidUntil,
                promoExpiryDate
            );

            acceleratedPromotionData.acceleratedDiscountReclaimPossible = acceleratedDiscountReclaimPossible;
            acceleratedPromotionData.savePercentageText = StringUtils.format(savePercentage, Math.ceil(discountAmount));
            acceleratedPromotionData.formattedPromoExpiryDate = dateUtils.getDateInMMDD(promoExpirationDate);

            acceleratedPromotionData.isPromoExpirationDateLessThanOneMonth = dateUtils.getMonthDiff(new Date(), new Date(promoExpirationDate)) < 1;
        }

        const handleClickUnsubscribe = () => {
            if (!isModifiable) {
                toggleModifySubscriptionErrorModal();
            } else {
                toggleUnsubscribeAutoReplenModal();
                setCurrentSubscription(subscription);
            }
        };

        const handleManageSubscription = () => {
            if (!isModifiable) {
                toggleModifySubscriptionErrorModal();
            } else {
                toggleManageSubscriptionModal();
                setCurrentSubscription(subscription);
            }
        };

        const handleResumeSubscription = () => {
            setCurrentSubscription(subscription);
            toggleResumeSubscriptionModal();
        };

        return {
            paused,
            save,
            annuallyWithSubscription,
            deliverEvery,
            itemText,
            nextShipment,
            pausedDelivery,
            resumeSubscription,
            manageSubscription,
            unsubscribe,
            isPaused,
            frequencyDelivery,
            displayItemVariation,
            promiseDate,
            savingAmount,
            listPrice,
            stillSave,
            before,
            handleClickUnsubscribe,
            handleManageSubscription,
            handleResumeSubscription,
            autoReplenishPromoInfoModalTitle,
            autoReplenishPromoInfoModalMsg1,
            autoReplenishPromoInfoModalMsg2,
            autoReplenishPromoInfoModalButton,
            or,
            getItBefore,
            ...acceleratedPromotionData
        };
    }
);

const functions = {
    showAutoReplenishPromoInfoModal: (options = {}) => {
        const commonModalOptions = {
            isOpen: true,
            bodyFooterPaddingX: 4,
            bodyFooterPaddingY: 4,
            showCancelButtonLeft: false
        };

        return showInfoModal({ ...commonModalOptions, ...options });
    }
};

const withAutoReplenishItemProps = connect(fields, functions);

export { withAutoReplenishItemProps };
