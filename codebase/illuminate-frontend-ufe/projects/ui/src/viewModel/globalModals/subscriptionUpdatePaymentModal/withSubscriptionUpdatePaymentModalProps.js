import { connect } from 'react-redux';
import { userSelector } from 'selectors/user/userSelector';
import CreditCardsSelector from 'selectors/page/autoReplenishment/creditCards/creditCardsSelector';
import { createSelector } from 'reselect';
import { localeSelector } from 'viewModel/selectors/locale/localeSelector';
import LanguageLocale from 'utils/LanguageLocale';
import AutoReplenishmentActions from 'actions/AutoReplenishmentActions';
import SameDayUnlimitedBindings from 'analytics/bindingMethods/pages/myAccount/SameDayUnlimitedBindings';
import AutoReplenishmentBindings from 'analytics/bindingMethods/pages/myAccount/AutoReplenishmentBindings';
import SubscriptionTypesConstants from 'constants/SubscriptionTypes';
import FrameworkUtils from 'utils/framework';

const {
    SUBSCRIPTION_TYPES: { SAME_DAY_UNLIMITED, AUTO_REPLENISHMENT }
} = SubscriptionTypesConstants;
const { wrapHOC } = FrameworkUtils;
const { creditCardsSelector } = CreditCardsSelector;

const getText = LanguageLocale.getLocaleResourceFile(
    'components/GlobalModals/SubscriptionUpdatePaymentModal/locales',
    'SubscriptionUpdatePaymentModal'
);

const KEYS = {
    SAVE_UPDATE: 'saveUpdateMethod'
};

const fields = createSelector(
    userSelector,
    creditCardsSelector,
    (_state, ownProps) => ownProps.paymentId,
    localeSelector,
    (user, creditCards, paymentId) => {
        const updatePaymentMethod = getText('updatePaymentMethod');
        const gotIt = getText('gotIt');
        const remove = getText('remove');
        const edit = getText('edit');
        const addNewCardTitle = getText('addNewCardTitle');
        const cancel = getText('cancel');
        const save = getText('save');
        const cvc = getText('cvc');
        const updateSecurityCode = getText('updateSecurityCode');
        const CVCDescription = getText('CVCDescription');
        const expiredCreditCardMsg = getText('expiredCreditCardMsg');
        const profileId = user.profileId;

        const creditCardList = creditCards.reduce((acc, creditCard) => {
            if (creditCard.creditCardId === paymentId) {
                acc.unshift(creditCard);
            } else {
                acc.push(creditCard);
            }

            return acc;
        }, []);

        const isChecked = creditCardId => {
            return creditCardId === paymentId;
        };

        const isDisabled = creditCard => {
            return creditCard.isExpired;
        };

        return {
            creditCardList,
            creditCards,
            updatePaymentMethod,
            gotIt,
            remove,
            edit,
            addNewCardTitle,
            cancel,
            save,
            cvc,
            updateSecurityCode,
            CVCDescription,
            expiredCreditCardMsg,
            profileId,
            paymentId,
            isChecked,
            isDisabled
        };
    }
);

const updateSubscriptionTypePayment = async function (ownProps, updateAutoReplenishmentSubscription, ...args) {
    const { currentSubscription } = ownProps;

    const {
        profileId, frequency, frequencyType, subscriptionId, type
    } = currentSubscription;

    const { selectedCreditCard, updatedSecurityCode, state } = args[0];

    await updateAutoReplenishmentSubscription(
        {
            profileId,
            frequency,
            frequencyType,
            items: [
                {
                    skuId: currentSubscription?.items[0]?.skuId,
                    qty: currentSubscription?.items[0]?.qty
                }
            ],
            subscriptionId: subscriptionId.toString(),
            shippingAddressId: currentSubscription?.shippingAddressId,
            paymentInfo: {
                paymentId: selectedCreditCard?.creditCardId,
                cvv: updatedSecurityCode,
                cardType: selectedCreditCard?.cardType
            }
        },
        ownProps.fireGenericErrorAnalytics
    ).then(response => {
        if (!response?.message) {
            ownProps.handleCurrentSubscriptionPaymentInfo(state);
            ownProps.onDismiss('saveUpdateMethod');

            // This modal is used for both auto-replenishment and same-day-unlimited subscriptions. We're only tracking
            // the same-day-unlimited subscription type.
            if (type === SAME_DAY_UNLIMITED) {
                SameDayUnlimitedBindings.updatePaymentSave(profileId);
            } else {
                AutoReplenishmentBindings.updatePaymentSave(currentSubscription);
            }
        }
    });
};

const functions = (dispatch, ownProps) => ({
    loadCreditCardList: function (...args) {
        const action = AutoReplenishmentActions.loadCreditCardList(...args);
        dispatch(action);
    },
    updateAutoReplenishmentSubscription: async function (...args) {
        const action = AutoReplenishmentActions.updateAutoReplenishmentSubscription(...args);
        await dispatch(action);
    },
    updateSubscriptionTypePayment: async function (...args) {
        await updateSubscriptionTypePayment(ownProps, this.updateAutoReplenishmentSubscription, ...args);
    },
    onModalClose: function (analyticsToken) {
        const {
            onDismiss,
            currentSubscription,
            currentSubscription: { type }
        } = ownProps;

        const analyticsMap = {
            [AUTO_REPLENISHMENT]: {
                [KEYS.SAVE_UPDATE]: AutoReplenishmentBindings.updatePaymentSave,
                default: AutoReplenishmentBindings.updatePaymentClose
            },
            [SAME_DAY_UNLIMITED]: {
                [KEYS.SAVE_UPDATE]: SameDayUnlimitedBindings.updatePaymentSave,
                default: SameDayUnlimitedBindings.updatePaymentClose
            }
        };

        const typeBindings = analyticsMap[type];

        if (typeBindings) {
            const analyticsCall = typeBindings[analyticsToken] || typeBindings.default;
            analyticsCall(currentSubscription);
        }

        onDismiss();
    },
    onRemoveClick: function ({ creditCard, creditCards, analyticsKey, currentSubscription }) {
        const { handleRemove } = ownProps;

        if (currentSubscription.type === SAME_DAY_UNLIMITED) {
            SameDayUnlimitedBindings.updatePaymentRemove();
        }

        if (currentSubscription.type === AUTO_REPLENISHMENT) {
            AutoReplenishmentBindings.updatePaymentRemove(currentSubscription);
        }

        handleRemove(creditCard, creditCards, analyticsKey);
    }
});

const withSubscriptionUpdatePaymentModalProps = wrapHOC(connect(fields, functions));

export {
    withSubscriptionUpdatePaymentModalProps, fields, functions
};
