import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Actions from 'Actions';
import AddToBasketActions from 'actions/AddToBasketActions';
import GiftMessageApiService from 'services/api/giftMessage';
import FrameworkUtils from 'utils/framework';
import Location from 'utils/Location';
import CheckoutUtils from 'utils/Checkout';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';

const { addOrUpdateGiftMessage, getGiftMessage } = GiftMessageApiService;
const { refreshCheckoutOrderDetails } = CheckoutUtils;
const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const { refreshBasket } = AddToBasketActions;
const { showAddGiftMessageModal } = Actions;
const getText = getLocaleResourceFile('components/GlobalModals/AddGiftMessageModal/locales', 'AddGiftMessageModal');

const fields = createStructuredSelector({
    title: getTextFromResource(getText, 'title'),
    subTitleScreen1: getTextFromResource(getText, 'subTitleScreen1'),
    subTitleScreen2: getTextFromResource(getText, 'subTitleScreen2'),
    subTitleScreen3: getTextFromResource(getText, 'subTitleScreen3'),
    next: getTextFromResource(getText, 'next'),
    back: getTextFromResource(getText, 'back'),
    preview: getTextFromResource(getText, 'preview'),
    recipientName: getTextFromResource(getText, 'recipientName'),
    yourName: getTextFromResource(getText, 'yourName'),
    recipientEmailAddress: getTextFromResource(getText, 'recipientEmailAddress'),
    giftMessage: getTextFromResource(getText, 'giftMessage'),
    enterRecipientNameError: getTextFromResource(getText, 'enterRecipientNameError'),
    enterYourNameError: getTextFromResource(getText, 'enterYourNameError'),
    invalidNameError: getTextFromResource(getText, 'invalidNameError'),
    enterRecipientEmailAddressError: getTextFromResource(getText, 'enterRecipientEmailAddressError'),
    invalidRecipientEmailAddressError: getTextFromResource(getText, 'invalidRecipientEmailAddressError'),
    giftMessageTimingMsg: getTextFromResource(getText, 'giftMessageTimingMsg'),
    toText: getTextFromResource(getText, 'toText'),
    fromText: getTextFromResource(getText, 'fromText'),
    save: getTextFromResource(getText, 'save'),
    errorMessageRequest: getTextFromResource(getText, 'errorMessageRequest')
});

const functions = dispatch => ({
    closeAddGiftMessageModal: () => {
        const action = showAddGiftMessageModal({ isOpen: false });
        dispatch(action);
    },
    addGiftMessage: (giftMessagePayload, errorCallback) => {
        addOrUpdateGiftMessage(giftMessagePayload, true)
            .then(() => {
                Location.isCheckout() ? refreshCheckoutOrderDetails(giftMessagePayload.orderId) : dispatch(refreshBasket());
                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        ...anaUtils.getLastAsyncPageLoadData(),
                        actionInfo: anaConsts.GIFT_MESSAGE_ACTIONS.GIFT_MESSAGE_ADDED,
                        linkName: anaConsts.GIFT_MESSAGE_ACTIONS.GIFT_MESSAGE_ADDED,
                        sTagInfo: {
                            giftMessagePayload: giftMessagePayload,
                            currentLanguage: giftMessagePayload.currentLanguage || '',
                            actionInfo: anaConsts.GIFT_MESSAGE_ACTIONS.GIFT_MESSAGE_SUBMIT_SUCCESS,
                            linkName: anaConsts.GIFT_MESSAGE_ACTIONS.GIFT_MESSAGE_SUBMIT_SUCCESS
                        }
                    }
                });
                dispatch(showAddGiftMessageModal({ isOpen: false }));
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
    },
    updateGiftMessage: giftMessagePayload => {
        addOrUpdateGiftMessage(giftMessagePayload, false).then(() => {
            Location.isCheckout() ? refreshCheckoutOrderDetails(giftMessagePayload.orderId) : dispatch(refreshBasket());
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    ...anaUtils.getLastAsyncPageLoadData(),
                    actionInfo: anaConsts.GIFT_MESSAGE_ACTIONS.GIFT_MESSAGE_UPDATED,
                    linkName: anaConsts.GIFT_MESSAGE_ACTIONS.GIFT_MESSAGE_UPDATED
                }
            });
            dispatch(showAddGiftMessageModal({ isOpen: false }));
        });
    },
    getGiftMessage,
    getSwatchOptions: languageThemes => {
        return languageThemes.map(theme => {
            return { key: theme.sid, name: theme.title };
        });
    },
    fireGiftMessageImageSelectAnalytics: giftMessagePayload => {
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                sTagInfo: {
                    ...giftMessagePayload,
                    actionInfo: anaConsts.GIFT_MESSAGE_ACTIONS.GIFT_MESSAGE_IMAGE_SELECT,
                    linkName: anaConsts.GIFT_MESSAGE_ACTIONS.GIFT_MESSAGE_IMAGE_SELECT
                }
            }
        });
    },
    fireErrorAnalytics: errorMessage => {
        import('analytics/bindings/pages/all/linkTrackingError').then(module => {
            const linkTrackingError = module.default;
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    bindingMethods: linkTrackingError,
                    fieldErrors: [anaConsts.PAGE_NAMES.GIFT_MESSAGE],
                    errorMessages: [errorMessage],
                    ...anaUtils.getLastAsyncPageLoadData()
                }
            });
        });
    }
});
const withAddGiftMessageModalProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withAddGiftMessageModalProps
};
