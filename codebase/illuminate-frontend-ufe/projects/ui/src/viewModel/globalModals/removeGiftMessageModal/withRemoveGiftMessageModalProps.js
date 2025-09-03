import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import Location from 'utils/Location';
import Actions from 'Actions';
import AddToBasketActions from 'actions/AddToBasketActions';
import GiftMessageApiService from 'services/api/giftMessage';
import CheckoutUtils from 'utils/Checkout';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';

const { deleteGiftMessage } = GiftMessageApiService;
const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const { showRemoveGiftMessageModal } = Actions;
const getText = getLocaleResourceFile('components/GlobalModals/RemoveGiftMessageModal/locales', 'RemoveGiftMessageModal');

const fields = createStructuredSelector({
    cancel: getTextFromResource(getText, 'cancel'),
    errorMessage: getTextFromResource(getText, 'errorMessage'),
    gotIt: getTextFromResource(getText, 'gotIt'),
    remove: getTextFromResource(getText, 'remove'),
    title: getTextFromResource(getText, 'title'),
    warningMessage: getTextFromResource(getText, 'warningMessage')
});

const functions = dispatch => ({
    closeRemoveGiftMessageModal: () => {
        const action = showRemoveGiftMessageModal({ isOpen: false });
        dispatch(action);
    },
    deleteExistingGiftMessage: (orderId, errorCallback) => {
        deleteGiftMessage(orderId)
            .then(() => {
                Location.isCheckout() ? CheckoutUtils.refreshCheckoutOrderDetails(orderId) : dispatch(AddToBasketActions.refreshBasket());
                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        ...anaUtils.getLastAsyncPageLoadData(),
                        actionInfo: anaConsts.GIFT_MESSAGE_ACTIONS.GIFT_MESSAGE_REMOVED,
                        linkName: anaConsts.GIFT_MESSAGE_ACTIONS.GIFT_MESSAGE_REMOVED
                    }
                });
                dispatch(showRemoveGiftMessageModal({ isOpen: false }));
            })
            .catch(error => {
                import('analytics/bindings/pages/all/linkTrackingError').then(module => {
                    const linkTrackingError = module.default;
                    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                        data: {
                            ...anaUtils.getLastAsyncPageLoadData(),
                            bindingMethods: linkTrackingError,
                            fieldErrors: [anaConsts.PAGE_NAMES.GIFT_MESSAGE],
                            errorMessages: error.errorMessages || [anaConsts.GIFT_MESSAGE_ACTIONS.GENERIC_ERROR_MESSAGE]
                        }
                    });
                });
                errorCallback();
            });
    }
});

const withRemoveGiftMessageModalProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withRemoveGiftMessageModalProps
};
