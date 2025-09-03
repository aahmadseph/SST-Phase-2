import { connect } from 'react-redux';
import { userSelector } from 'selectors/user/userSelector';
import countrySelector from 'selectors/page/autoReplenishment/countrySelector/countrySelector';
import editDataSelector from 'selectors/editData/editDataSelector';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import LanguageLocale from 'utils/LanguageLocale';
import AutoReplenishmentActions from 'actions/AutoReplenishmentActions';
import OrderActions from 'actions/OrderActions';
import FrameworkUtils from 'utils/framework';
import FormsUtils from 'utils/Forms';
import OrderUtils from 'utils/Order';
import SameDayUnlimitedBindings from 'analytics/bindingMethods/pages/myAccount/SameDayUnlimitedBindings';
import SubscriptionTypeConsts from 'constants/SubscriptionTypes';
import AutoReplenishmentBindings from 'analytics/bindingMethods/pages/myAccount/AutoReplenishmentBindings';

const { PAYMENT_GROUP_TYPE } = OrderUtils;
const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const {
    SUBSCRIPTION_TYPES: { SAME_DAY_UNLIMITED, AUTO_REPLENISHMENT }
} = SubscriptionTypeConsts;

const getText = getLocaleResourceFile('components/GlobalModals/AddPaymentMethodModal/locales', 'AddPaymentMethodModal');

const formName = FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.CHECKOUT.CREDIT_CARD);

const fields = createSelector(
    userSelector,
    countrySelector,
    editDataSelector,
    createStructuredSelector({
        addNewCard: getTextFromResource(getText, 'addNewCard'),
        editCreditCard: getTextFromResource(getText, 'editCreditCard'),
        cardNumberDisplay: getTextFromResource(getText, 'cardNumberDisplay'),
        save: getTextFromResource(getText, 'save'),
        cancel: getTextFromResource(getText, 'cancel'),
        setDefault: getTextFromResource(getText, 'setDefault'),
        cardNumberIncorrect: getTextFromResource(getText, 'cardNumberIncorrect'),
        cardNumberRequired: getTextFromResource(getText, 'cardNumberRequired'),
        expirationMonthRequired: getTextFromResource(getText, 'expirationMonthRequired'),
        expirationYearRequired: getTextFromResource(getText, 'expirationYearRequired'),
        update: getTextFromResource(getText, 'update'),
        deleteCard: getTextFromResource(getText, 'deleteCard'),
        cardTypeTitle: getTextFromResource(getText, 'cardTypeTitle'),
        cardNumberTitle: getTextFromResource(getText, 'cardNumberTitle'),
        mm: getTextFromResource(getText, 'mm'),
        yy: getTextFromResource(getText, 'yy'),
        cvc: getTextFromResource(getText, 'cvc')
    }),
    (user, countries, editData, textResources) => {
        const profileLocale = user.profileLocale;
        const profileId = user.profileId;
        const COUNTRIES = LanguageLocale.COUNTRIES;
        const editStore = editData[formName] || { creditCard: {} };
        const paymentGroupType = PAYMENT_GROUP_TYPE.CREDIT_CARD;

        return {
            ...textResources,
            countries,
            profileId,
            profileLocale,
            COUNTRIES,
            editStore,
            paymentGroupType,
            formName
        };
    }
);
const functions = (dispatch, ownProps) => ({
    loadCountries: async (...args) => {
        const action = AutoReplenishmentActions.loadCountries(...args);
        await dispatch(action);
    },
    addOrUpdateCreditCard: async (...args) => {
        const action = AutoReplenishmentActions.addOrUpdateCreditCard(...args);
        await dispatch(action);
    },
    updateEditDataAction: async (...args) => {
        const action = AutoReplenishmentActions.updateEditDataAction(...args);
        await dispatch(action);
    },
    setDefaultCCOnProfileAndDelete: async (...args) => {
        const action = AutoReplenishmentActions.setDefaultCCOnProfileAndDelete(...args);
        await dispatch(action);
    },
    removeCreditCard: async (...args) => {
        const action = AutoReplenishmentActions.removeCreditCard(...args);
        await dispatch(action);
    },
    paymentCardNumberChanged: (...args) => {
        const action = OrderActions.paymentCardNumberChanged(...args);
        dispatch(action);
    },
    openCVCModal: () => {
        const action = OrderActions.showCVCInfoModal(true);
        dispatch(action);
    },
    onModalClose: (editMode, analyticsKey, isEditMode) => {
        const {
            onDismiss,
            currentSubscription,
            currentSubscription: { type }
        } = ownProps;

        if (type === SAME_DAY_UNLIMITED) {
            if (isEditMode) {
                SameDayUnlimitedBindings.editPaymentClose();
            } else {
                SameDayUnlimitedBindings.addPaymentClose();
            }
        }

        if (type === AUTO_REPLENISHMENT) {
            if (isEditMode) {
                AutoReplenishmentBindings.editCardModalClose(currentSubscription);
            } else {
                AutoReplenishmentBindings.addCardModalClose(currentSubscription);
            }
        }

        onDismiss(editMode, analyticsKey, isEditMode);
    },
    onSavedCard: ({ isEditMode }) => {
        const {
            currentSubscription,
            currentSubscription: { type }
        } = ownProps;

        if (type === AUTO_REPLENISHMENT) {
            if (isEditMode) {
                AutoReplenishmentBindings.savedEditedCard(currentSubscription);
            } else {
                AutoReplenishmentBindings.savedAddedCard(currentSubscription);
            }
        }
    }
});

const withAddPaymentMethodModalProps = wrapHOC(connect(fields, functions));

export {
    withAddPaymentMethodModalProps, fields, functions
};
