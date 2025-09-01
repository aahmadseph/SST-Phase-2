import AlternatePickupPersonModal from 'components/GlobalModals/AlternatePickupPersonModal/AlternatePickupPersonModal';
import withGlobalModals from 'hocs/withGlobalModals';
import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import OrderActions from 'actions/OrderActions';
import sduAgreementActions from 'actions/sduAgreementActions';
import Actions from 'Actions';
import CheckoutApi from 'services/api/checkout';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const { showPrivacyPolicyModal, showTermsAndConditionsModal, showTermsOfServiceModal } = sduAgreementActions;

const getText = getLocaleResourceFile('components/GlobalModals/AlternatePickupPersonModal/locales', 'AlternatePickupPersonModal');

const fields = createSelector(
    orderDetailsSelector,
    createStructuredSelector({
        alternatePickupPerson: getTextFromResource(getText, 'alternatePickupPerson'),
        ok: getTextFromResource(getText, 'ok'),
        removeAltPickupTitle: getTextFromResource(getText, 'removeAltPickupTitle'),
        genericErrorMessage: getTextFromResource(getText, 'genericErrorMessage'),
        firstName: getTextFromResource(getText, 'firstName'),
        lastName: getTextFromResource(getText, 'lastName'),
        email: getTextFromResource(getText, 'email'),
        save: getTextFromResource(getText, 'save'),
        cancel: getTextFromResource(getText, 'cancel'),
        pickupStore: getTextFromResource(getText, 'pickupStore'),
        serviceSLA: getTextFromResource(getText, 'serviceSLA'),
        inStorePickup: getTextFromResource(getText, 'inStorePickup'),
        curbSidePickup: getTextFromResource(getText, 'curbSidePickup'),
        confirmationDetails: getTextFromResource(getText, 'confirmationDetails')
    }),
    (orderDetails, localization) => {
        const storeDetails = orderDetails?.pickup?.storeDetails;
        const orderId = orderDetails?.header?.orderId;

        return {
            addAlternatePickupPerson: CheckoutApi.addAlternatePickupPerson,
            updateAlternatePickupPerson: CheckoutApi.updateAlternatePickupPerson,
            removeAlternatePickupPerson: CheckoutApi.removeAlternatePickupPerson,
            localization,
            storeDetails,
            orderId
        };
    }
);

const functions = {
    showTermsOfServiceModal,
    showTermsAndConditionsModal,
    showPrivacyPolicyModal,
    updateSDUTerms: OrderActions.updateSDUTerms,
    showAlternatePickupPersonModal: Actions.showAlternatePickupPersonModal,
    showInfoModal: Actions.showInfoModal
};

const withAlternatePickupPersonModalProps = wrapHOC(connect(fields, functions));

export default withGlobalModals(withAlternatePickupPersonModalProps(AlternatePickupPersonModal));
