import store from 'store/Store';
import Actions from 'Actions';

export const globalModals = {
    SHIPPING_AND_HANDLING_INFO: 'shippingHandlingInfo',
    GIFT_CARD_CHECKOUT_INFO: 'giftCardCheckoutInfo',
    FEDEX_PICKUP_LOCATION_INFO: 'fedExPickupLocationInfo',
    TERMS_AND_CONDITIONS: 'sameDayUnlimitedTermsConditions',
    TERMS_OF_SERVICE: 'sameDayUnlimitedTermsOfService',
    PRIVACY_POLICY: 'sameDayUnlimitedPrivacyPolicy',
    BEAUTY_INSIDER_CASH_INFO: 'beautyInsiderCashInfo',
    CREDIT_CARD_REWARDS_INFO: 'creditCardRewardsInfo',
    BOPIS_BAG_FEE_INFO: 'bopisBagFeeInfo',
    BOPIS_PIF_FEE_INFO: 'bopisPifFeeInfo',
    BOPIS_SALES_TAX_INFO: 'bopisSalesTaxInfo',
    SALES_TAX_INFO: 'salesTaxInfo',
    BOPIS_ORDER_CONFIRMATION_CONTENT: 'bopisOrderConfirmationContent',
    BOPIS_SERVICE_INFO_FAQS: 'bopisServiceInfoFaQs',
    CREDIT_CARD_PRESCREEN_CBCC: 'creditCardPrescreenCbcc',
    CREDIT_CARD_PRESCREEN_PLCC: 'creditCardPrescreenPlcc',
    RETAIL_DELIVERY_FEE_INFO: 'retailDeliveryFeeInfo',
    SDU_SERVICE_INFO: 'sameDayUnlimitedServiceInfo',
    SDD_FULFILLMENT_SERVICE_INFO: 'sameDayDeliveryFulfillmentServiceInfo',
    AUTO_REPLENISH_FAQS: 'autoReplenishFaQs',
    AUTO_REPLENISH_PRODUCT_INFO: 'autoReplenishProductInfo',
    COMMUNITY_RATINGS_REVIEWS: 'communityRatingsReviews',
    SDU_SERVICE_FAQS: 'sameDayUnlimitedServiceFaQs',
    SDU_ACCOUNT_PAGE_CONTENT: 'sameDayUnlimitedAccountPageContent',
    COMMUNITY_QUESTIONS_AND_ANSWERS: 'communityQuestionsAnswers',
    POINT_MULTIPLIER_EVENT_INFO: 'pointMultiplierEventInfo',
    AUTO_REPLENISH_TERMS_CONDITIONS: 'autoReplenishTermsConditions',
    SDU_SCRIPT: 'sameDayUnlimitedScript'
};

export const renderModal = (data = {}, bccFallback = () => {}, isPrescreenModal = false) => {
    const {
        sid, title, width, showCloseButton, isDrawer, footerAlign, closeButtonText, closeButtonWidth
    } = data;

    if (sid) {
        store.dispatch(
            Actions.showContentModal({
                isOpen: true,
                data: {
                    sid,
                    title,
                    width,
                    isPrescreenModal,
                    showCloseButton,
                    isDrawer,
                    footerAlign,
                    closeButtonText,
                    closeButtonWidth
                }
            })
        );
    } else {
        bccFallback();
    }
};
