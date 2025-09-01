/* eslint-disable complexity */
import React, { lazy } from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import withSuspenseLoadHoc from 'utils/framework/hocs/withSuspenseLoadHoc';

// ---------------------------------------------CAN BE LAZY LOADED IN POSTLOAD ---------------------------------------------
const RegisterModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/RegisterModal/RegisterModal'))
);
const CheckYourEmailModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/CheckYourEmailModal'))
);
const EmailLookupModal = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/EmailLookupModal')));

const RemovePhoneConfirmationModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/RemovePhoneConfirmationModal'))
);

const UFEModal = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/UFEModal/UFEModal')));
const SignInModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/SignInModal/SignInModal'))
);
const SignInWithAuthenticateModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/EDP/SignInWithAuthenticateModal/SignInWithAuthenticateModal'))
);
const SMSSignInModal = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/SMSSignInModal')));
const BiRegisterModal = withSuspenseLoadHoc(
    lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/BiRegisterModal/BiRegisterModal'))
);
const ForgotPasswordModal = withSuspenseLoadHoc(
    lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ForgotPasswordModal/ForgotPasswordModal'))
);
const QuickLookModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/QuickLookModal/QuickLookModal'))
);
const AddGiftMessageModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/AddGiftMessageModal'))
);
const RemoveGiftMessageModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/RemoveGiftMessageModal'))
);
const GiftAddressWarningModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/GiftAddressWarningModal'))
);
const InfoModal = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/InfoModal/InfoModal')));
const BeautyPreferencesModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/BeautyPreferencesModal'))
);
const BeautyPreferencesSavedModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/BeautyPreferencesModal/BeautyPreferencesSavedModal'))
);
const CreditCardPrescreenModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/CreditCardPrescreenModal/CreditCardPrescreenModal'))
);
const SignInWithMessagingModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/SignInWithMessagingModal/SignInWithMessagingModal'))
);
const RougeRewardCardModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/RougeRewardCardModal/RougeRewardCardModal'))
);
const AddToBasketModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/AddToBasketModal/AddToBasketModal'))
);
const BccModal = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/Bcc/BccModal')));
const ChildContentModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ChildContentModal'))
);
const ContentModal = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ContentModal')));
const EmailMeWhenInStockModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/EmailMeWhenInStockModal/EmailMeWhenInStockModal'))
);
const CountrySwitcherModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/CountrySwitcherModal/CountrySwitcherModal'))
);
const MobileConfirmModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/MobileConfirmModal'))
);
const BuyNowPayLaterModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/BuyNowPayLaterModal/BuyNowPayLaterModal'))
);
const MediaPopup = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/MediaPopup/MediaPopup')));
const SMSSignupModal = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/SMSSignupModal')));
const SampleModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/SampleModal/SampleModal'))
);
const VideoModal = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/VideoModal/VideoModal')));
const PromoModal = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/PromoModal/PromoModal')));
const ColorIQModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ColorIQModal/ColorIQModal'))
);
const RewardModal = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/RewardModal')));
const ApplyRewardsModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ApplyRewardsModal/ApplyRewardsModal'))
);
const OrderConfirmRewardModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/OrderConfirmRewardModal/OrderConfirmRewardModal'))
);
const SocialRegistrationModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/SocialRegistrationModal/SocialRegistrationModal'))
);
const SocialReOptModal = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/SocialReOptModal')));
const EditFlowModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/RichProfile/EditMyProfile/Modals/EditFlowModal'))
);
const EditMyProfileModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/RichProfile/EditMyProfile/Modals/EditMyProfileModal/EditMyProfileModal'))
);
const ExtendSessionModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ExtendSessionModal/ExtendSessionModal'))
);
const ProductFinderModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ProductFinderModal/ProductFinderModal'))
);
const ShareLoveListLinkModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ShareLoveListLinkModal/ShareLoveListLinkModal'))
);
const ShareLinkModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ShareLinkModal/ShareLinkModal'))
);
const OrderCancelationModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/OrderCancelationModal/OrderCancelationModal'))
);
const FindInStoreModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/FindInStore/FindInStoreModal/FindInStoreModal'))
);
const FindInStoreMapModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/FindInStore/FindInStoreMapModal/FindInStoreMapModal'))
);
const ScanRewardCardModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ScanRewardCardModal'))
);
const CreditReportDetailsModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/CreditReportDetailsModal/CreditReportDetailsModal'))
);
const ExtendSessionFailureModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ExtendSessionFailureModal/ExtendSessionFailureModal'))
);
const ProductMediaZoomModal = withSuspenseLoadHoc(
    React.lazy(
        () => import(/* webpackChunkName: "postload" */ 'components/ProductPage/ProductMediaCarousel/ProductMediaZoomModal/ProductMediaZoomModal')
    )
);
const SimilarProductsModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/SimilarProductsModal/SimilarProductsModal'))
);
const AddressVerificationModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/AddressVerificationModal/AddressVerificationModal'))
);
const ReserveAndPickUpModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ReserveAndPickUpModal/ReserveAndPickUpModal'))
);
const ReviewImageModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/ProductPage/RatingsAndReviews/ReviewImageModal/ReviewImageModal'))
);
const BeautyTraitsModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/ProductPage/RatingsAndReviews/ReviewsFilters/BeautyTraitsModal'))
);
const CreditCardOfferModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/CreditCardOfferModal/CreditCardOfferModal'))
);
const FreeReturnsModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/FreeReturnsModal/FreeReturnsModal'))
);
const ProductSamplesModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ProductSamplesModal'))
);
const PasskeysInfoModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/PasskeysInfoModal/PasskeysInfoModal'))
);
const StoreSwitcher = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/Header/StoreSwitcher')));
const ShippingDeliveryLocationModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ShippingDeliveryLocationModal/ShippingDeliveryLocationModal'))
);
const CurbsidePickupCheckinModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'pages/Community/RichProfile/MyAccount/CurbsidePickupCheckinModal'))
);
const MarkdownModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/MarkdownModal/MarkdownModal'))
);
const DeliveryIssueModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/DeliveryIssueModal'))
);
const ConsumerPrivacyModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ConsumerPrivacyModal'))
);
const AccountDeactivatedModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/AccountDeactivatedModal'))
);
const CloseAccountModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/CloseAccountModal'))
);
const CheckPasswordModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/CheckPasswordModal'))
);
const ManageListModal = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ManageListModal')));
const DeleteListModal = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/DeleteListModal')));
const GalleryLightBoxModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/GalleryLightBoxModal'))
);
const GameInfoModal = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/GameInfoModal')));
const GalleryLightBoxKebabModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/GalleryLightBoxKebabModal'))
);
const ReportContentModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ReportContentModal'))
);
const LocationAndStoresModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/LocationAndStoresModal'))
);
const ResetPasswordConfirmationModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ResetPasswordConfirmationModal'))
);
const MultipleRougeRewardsModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/MultipleRougeRewardsModal'))
);
const RewardsBazaarModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/RewardsBazaarModal'))
);
const FreeSamplesModal = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/FreeSamplesModal')));
const ItemSubstitutionModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/ItemSubstitution/ItemSubstitutionModal'))
);
const BiCardModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/BiCardModal/BiCardModal'))
);
const EditBeautyPreferencesModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/EditBeautyPreferencesModal'))
);
const EDPConfirmRsvpModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/EDPConfirmRsvpModal'))
);
const TaxclaimErrorModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/TaxClaim/TaxclaimErrorModal'))
);
const SDUAgreementModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/SDUAgreementModal'))
);
const AlternatePickupPersonModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/AlternatePickupPersonModal'))
);
const ShadeFinderQuiz = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/ShadeFinder')));
const PlaceOrderTermsModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/PlaceOrderTermsModal'))
);
const MyListsModal = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/MyListsModal')));
const EmailTypoModal = withSuspenseLoadHoc(React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/EmailTypoModal')));
const AutoReplenishProductsModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/AutoReplenishProductsModal'))
);
const ChooseOptionsModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/ChooseOptionsModal'))
);
const GenericErrorModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/GenericErrorModal'))
);
const SDULandingPageModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/SDULandingPageModal'))
);

import { COLORIQ_SPOKE_COMPONENT_NAME } from 'constants/beautyPreferences';
import locationUtils from 'utils/Location';
import localeUtils from 'utils/LanguageLocale';

class GlobalModalsWrapper extends BaseClass {
    componentDidMount() {
        this.props.enableModals();
    }

    render() {
        if (!this.props.renderModals) {
            return null;
        }

        if (this.props.showAddGiftMessageModal) {
            return (
                <AddGiftMessageModal
                    close={this.props.close}
                    isOpen={this.props.showAddGiftMessageModal}
                    languageThemes={this.props.languageThemes}
                    orderId={this.props.giftMessageOrderId}
                    isEditGiftMessage={this.props.isEditGiftMessage}
                />
            );
        }

        if (this.props.showRemoveGiftMessageModal) {
            return <RemoveGiftMessageModal orderId={this.props.giftMessageOrderId} />;
        }

        if (this.props.showGiftAddressWarningModal) {
            return (
                <GiftAddressWarningModal
                    recipientName={this.props.giftAddressWarningRecipientName}
                    placeOrderCallback={this.props.giftAddressWarningCallback}
                />
            );
        }

        // The Check Your Email modal must appear on top of any other modal in the screen
        if (this.props.showCheckYourEmailModal) {
            return (
                <CheckYourEmailModal
                    isOpen={this.props.showCheckYourEmailModal}
                    email={this.props.email}
                    token={this.props.token}
                    isResetPasswordFlow={this.props.isResetPasswordFlow}
                />
            );
        }

        if (this.props.showEmailLookupModal) {
            return (
                <EmailLookupModal
                    isOpen={this.props.showEmailLookupModal}
                    originalArgumentsObj={this.props.originalArgumentsObj}
                />
            );
        }

        if (this.props.showRemovePhoneConfirmationModal) {
            return (
                <RemovePhoneConfirmationModal
                    isOpen={this.props.showRemovePhoneConfirmationModal}
                    onCancel={this.props.onCancel}
                    onContinue={this.props.onContinue}
                    phoneNumber={this.props.phoneNumber}
                />
            );
        }

        // showInfoModal should appear before ATB, Forgot Password, Quicklook
        // showBeautyPreferencesModal and BiRegisterModal modals
        if (this.props.showInfoModal) {
            return (
                <InfoModal
                    isOpen={this.props.showInfoModal}
                    title={this.props.infoModalTitle}
                    message={this.props.infoModalMessage}
                    isHtml={this.props.infoModalMessageIsHtml}
                    buttonText={this.props.infoModalButtonText}
                    buttonWidth={this.props.infoModalButtonWidth}
                    cancelText={this.props.infoModalCancelText}
                    showCancelButton={this.props.showInfoModalCancelButton}
                    showCancelButtonLeft={this.props.showInfoModalCancelButtonLeft}
                    footerColumns={this.props.infoModalFooterColumns}
                    footerGridGap={this.props.infoModalFooterGridGap}
                    footerDisplay={this.props.infoModalFooterDisplay}
                    footerJustifyContent={this.props.infoModalFooterJustifyContent}
                    bodyFooterPaddingX={this.props.infoModalBodyFooterPaddingX}
                    bodyPaddingBottom={this.props.infoModalBodyPaddingBottom}
                    showFooterBorder={this.props.infoModalShowFooterBorder}
                    callback={this.props.infoModalCallback}
                    cancelCallback={this.props.infoModalCancelCallback}
                    confirmMsgObj={this.props.confirmMsgObj}
                    showCloseButton={this.props.showCloseButton}
                    dataAt={this.props.dataAt}
                    dataAtTitle={this.props.dataAtTitle}
                    dataAtMessage={this.props.dataAtMessage}
                    dataAtMessageContext={this.props.dataAtMessageContext}
                    dataAtButton={this.props.dataAtButton}
                    dataAtCancelButton={this.props.dataAtCancelButton}
                    dataAtClose={this.props.dataAtClose}
                    cancelButtonCallback={this.props.infoModalCancelButtonCallback}
                    width={this.props.infoModalWidth}
                    showFooter={this.props.showInfoModalFooter}
                />
            );
        }

        if (this.props.showBeautyPreferencesModal) {
            return <BeautyPreferencesModal isOpen={this.props.showBeautyPreferencesModal} />;
        }

        if (this.props.showBeautyPreferencesSavedModal) {
            return (
                <BeautyPreferencesSavedModal
                    close={this.props.close}
                    isOpen={this.props.showBeautyPreferencesSavedModal}
                    savedTitle={this.props.savedTitle}
                    savedMessage1={this.props.savedMessage1}
                    savedMessage2={this.props.savedMessage2}
                    savedMessage3={this.props.savedMessage3}
                    linkText={this.props.linkText}
                    keepGoing={this.props.keepGoing}
                    gotIt={this.props.gotIt}
                    callback={this.props.callback}
                    cancelCallback={this.props.cancelCallback}
                />
            );
        }

        if (this.props.showUFEModal) {
            return (
                <UFEModal
                    isOpen={this.props.showUFEModal}
                    ufeModalId={this.props.ufeModalId}
                />
            );
        }

        if (this.props.showSignInModal) {
            return (
                <SignInModal
                    isOpen={this.props.showSignInModal}
                    email={this.props.email}
                    messages={this.props.signInMessages}
                    callback={this.props.signInCallback}
                    errback={this.props.signInErrback}
                    isNewUserFlow={this.props.isNewUserFlow}
                    source={this.props.signInSource}
                    isEmailDisabled={this.props.signInData.isEmailDisabled}
                    isRadioDisabled={this.props.signInData.isRadioDisabled}
                    isSSIEnabled={this.props.signInData.isSSIEnabled}
                    analyticsData={this.props.analyticsData}
                    extraParams={this.props.extraParams}
                    showBeautyPreferencesFlow={this.props.showBeautyPreferencesFlow}
                    isOrderConfirmation={this.props.isOrderConfirmation}
                />
            );
        }

        if (this.props.showPasskeysInfoModal) {
            return <PasskeysInfoModal isOpen={this.props.showPasskeysInfoModal} />;
        }

        if (this.props.showTaxclaimErrorModal) {
            return (
                <TaxclaimErrorModal
                    isOpen={this.props.showTaxclaimErrorModal.isOpen}
                    errorType={this.props.showTaxclaimErrorModal?.errorType}
                    errorTypeLocaleMessage={this.props.showTaxclaimErrorModal?.errorTypeLocaleMessage}
                />
            );
        }

        if (this.props.showAuthenticateModal) {
            return (
                <SignInWithAuthenticateModal
                    activityDetails={this.props.activityDetails}
                    analyticsData={this.props.analyticsData}
                    callback={this.props.callback}
                    contextComponent={this.props.contextComponent}
                    getGuestDetails={this.props.getGuestDetails}
                    isEmailDisabled={this.props.signInData.isEmailDisabled}
                    isOpen={this.props.showAuthenticateModal}
                    isRadioDisabled={this.props.signInData.isRadioDisabled}
                    isSSIEnabled={this.props.signInData.isSSIEnabled}
                    onSubmit={this.props.onSubmit}
                />
            );
        }

        if (this.props.showSignInWithMessagingModal) {
            return (
                <SignInWithMessagingModal
                    isOpen={this.props.showSignInWithMessagingModal}
                    isGuestBookingEnabled={this.props.isGuestBookingEnabled}
                    potentialServiceBIPoints={this.props.potentialServiceBIPoints}
                    messages={this.props.signInMessages}
                    callback={this.props.signInCallback}
                    errback={this.props.signInErrback}
                    isPaypalFlow={this.props.isPaypalFlow}
                    isApplePayFlow={this.props.isApplePayFlow}
                    isEmailDisabled={this.props.signInData.isEmailDisabled}
                    isRadioDisabled={this.props.signInData.isRadioDisabled}
                    isSSIEnabled={this.props.signInData.isSSIEnabled}
                    isCreditCardApply={this.props.isCreditCardApply}
                    extraParams={this.props.extraParams}
                />
            );
        }

        if (this.props.showChildContentModal) {
            return (
                <ChildContentModal
                    isOpen={true}
                    childData={this.props.childData}
                />
            );
        }

        if (this.props.showRegisterModal) {
            return (
                // ILLUPH-125210 Revert after completion of test
                <RegisterModal
                    isOpen={this.props.showRegisterModal}
                    openPostBiSignUpModal={this.props.openPostBiSignUpModal}
                    presetLogin={this.props.presetLogin}
                    isStoreUser={this.props.isStoreUser}
                    isCreditCardApply={this.props.isCreditCardApply}
                    biData={this.props.biData}
                    callback={this.props.registerCallback}
                    errback={this.props.registerErrback}
                    analyticsData={this.props.analyticsData}
                    extraParams={this.props.extraParams}
                    isCompleteAccountSetupModal={this.props.isCompleteAccountSetupModal}
                    isEpvEmailValidation={this.props.isEpvEmailValidation}
                    isEmailDisabled={this.props.isEmailDisabled}
                    isSSIEnabled={this.props.isSSIEnabled}
                />
            );
        }

        //showBiRegisterModal must come before showQuickLookModal due to order of appearance
        if (this.props.showBiRegisterModal) {
            return (
                <BiRegisterModal
                    isOpen={this.props.showBiRegisterModal}
                    callback={this.props.biRegisterCallback}
                    cancellationCallback={this.props.biRegisterCancellationCallback}
                    isCommunity={this.props.isCommunity}
                    isCreditCardApply={this.props.isCreditCardApply}
                    analyticsData={this.props.analyticsData}
                    extraParams={this.props.extraParams}
                />
            );
        }

        //showRougeRewardCardModal must come before showQuickLookModal due to order of appearance
        if (this.props.showRougeRewardCardModal) {
            return (
                <RougeRewardCardModal
                    isOpen={this.props.showRougeRewardCardModal}
                    sku={this.props.rougeRewardCardModalSku}
                    callback={this.props.rougeRewardCardModalCallback}
                    analyticsContext={this.props.analyticsContext}
                    isRougeExclusiveCarousel={this.props.isRougeExclusiveCarousel}
                />
            );
        }

        // showForgotPasswordModal must come before showAddToBasketModal due to order of appearance
        if (this.props.showForgotPasswordModal) {
            return (
                <ForgotPasswordModal
                    isOpen={this.props.showForgotPasswordModal}
                    presetLogin={this.props.presetLogin}
                />
            );
        }

        //showAddToBasketModal must come before showQuickLookModal due to order of appearance
        if (this.props.showAddToBasketModal) {
            return (
                <AddToBasketModal
                    analyticsContext={this.props.analyticsContext}
                    error={this.props.error}
                    basketType={this.props.basketType}
                    isOpen={this.props.showAddToBasketModal}
                    preferredStoreName={this.props.preferredStoreName}
                    product={this.props.addedProduct}
                    qty={this.props.itemQty}
                    sku={this.props.addedSku}
                    title={this.props.title}
                    replenishmentFrequency={this.props.replenishmentFrequency}
                    replenishmentSelected={this.props.replenishmentSelected}
                    isAutoReplenMostCommon={this.props.isAutoReplenMostCommon}
                />
            );
        }

        //QuickLookModal must come before BccModal due to order of appearance
        if (this.props.showMyListsModal) {
            return (
                <MyListsModal
                    isOpen={this.props.showMyListsModal}
                    showCreateListModal={this.props.showCreateListModal}
                />
            );
        }

        //QuickLookModal must come before BccModal due to order of appearance
        if (this.props.showQuickLookModal) {
            return (
                <QuickLookModal
                    isOpen={this.props.showQuickLookModal}
                    product={this.props.quickLookProduct}
                    skuType={this.props.skuType}
                    sku={this.props.quickLookSku}
                    error={this.props.error}
                    platform={this.props.platform}
                    origin={this.props.origin}
                    analyticsContext={this.props.analyticsContext}
                    isDisabled={this.props.isDisabled}
                    rootContainerName={this.props.rootContainerName}
                    categoryProducts={this.props.categoryProducts}
                    isCommunityGallery={this.props.isCommunityGallery}
                    communityGalleryAnalytics={this.props.communityGalleryAnalytics}
                />
            );
        }

        if (this.props.showBccModal) {
            return (
                <BccModal
                    {...this.props.bccModalTemplate}
                    seoName={this.props.seoName}
                    width={this.props.width}
                    modalState={this.props.showBccModal}
                />
            );
        }

        if (this.props.showDeleteListModal) {
            return (
                <DeleteListModal
                    isOpen={this.props.showDeleteListModal}
                    customListId={this.props.customListId}
                />
            );
        }

        if (this.props.showManageListModal) {
            return (
                <ManageListModal
                    isOpen={this.props.showManageListModal}
                    listName={this.props.listName}
                    loveListId={this.props.loveListId}
                />
            );
        }

        if (this.props.showContentModal) {
            return (
                <ContentModal
                    isOpen={true}
                    data={this.props.data}
                />
            );
        }

        if (this.props.showEmailMeWhenInStockModal) {
            return (
                <EmailMeWhenInStockModal
                    isOpen={this.props.showEmailMeWhenInStockModal}
                    product={this.props.emailInStockProduct}
                    currentSku={this.props.emailInStockSku}
                    isQuickLook={this.props.isQuickLook}
                    alreadySubscribed={
                        this.props.emailInStockProduct.currentSku &&
                        this.props.emailInStockProduct.currentSku.actionFlags &&
                        this.props.emailInStockProduct.currentSku.actionFlags.backInStockReminderStatus === 'active'
                    }
                    updateEmailButtonCTA={this.props.updateEmailButtonCTA}
                    isComingSoon={this.props.isComingSoon}
                    analyticsContext={this.props.analyticsContext}
                />
            );
        }

        if (this.props.showCountrySwitcherModal) {
            return (
                <CountrySwitcherModal
                    isOpen={this.props.showCountrySwitcherModal}
                    desiredCountry={this.props.desiredCountry}
                    desiredLang={this.props.desiredLang}
                    switchCountryName={this.props.switchCountryName}
                />
            );
        }

        if (this.props.showMobileConfirmModal) {
            return (
                <MobileConfirmModal
                    isOpen={this.props.showMobileConfirmModal}
                    mobilePhone={this.props.mobilePhone}
                    onContinue={this.props.onContinue}
                />
            );
        }

        if (this.props.showBuyNowPayLaterModal) {
            return (
                <BuyNowPayLaterModal
                    isOpen={this.props.showBuyNowPayLaterModal}
                    installmentValue={this.props.buyNowPayLaterInstallment}
                    totalAmount={this.props.buyNowPayLaterTotalAmount}
                    showAfterpay={this.props.showAfterpay}
                    showKlarna={this.props.showKlarna}
                    showPaypal={this.props.showPaypal}
                    selectedPaymentMethod={this.props.selectedPaymentMethod}
                />
            );
        }

        if (this.props.showMediaModal) {
            return (
                <MediaPopup
                    showContent={true}
                    isOpen={this.props.showMediaModal}
                    mediaId={this.props.mediaModalId}
                    title={this.props.mediaModalTitle}
                    titleDataAt={this.props.mediaModalTitleDataAt}
                    bodyDataAt={this.props.mediaModalBodyDataAt}
                    onClose={this.props.mediaModalClose}
                    onCloseDataAt={this.props.mediaModalCloseDataAt}
                    width={this.props.width}
                    showMediaTitle={this.props.showMediaTitle}
                    dismissButtonText={this.props.dismissButtonText}
                    dismissButtonDataAt={this.props.dismissButtonDataAt}
                    dataAt={this.props.modalDataAt}
                />
            );
        }

        if (this.props.showSMSSignupModal) {
            return (
                <SMSSignupModal
                    isOpen={this.props.showSMSSignupModal}
                    close={this.props.close}
                />
            );
        }

        if (this.props.showSampleModal) {
            return (
                <SampleModal
                    showContent={true}
                    isOpen={this.props.showSampleModal}
                    sampleList={this.props.sampleList}
                    allowedQtyPerOrder={this.props.allowedQtyPerOrder}
                    samplesMessage={this.props.samplesMessage}
                    analyticsContext={this.props.analyticsContext}
                />
            );
        }

        if (this.props.showVideoModal) {
            return (
                <VideoModal
                    showContent={true}
                    isOpen={this.props.showVideoModal}
                    videoTitle={this.props.videoTitle}
                    videoModalUpdated={this.props.videoModalUpdated}
                    video={this.props.video}
                />
            );
        }

        if (this.props.showPromoModal) {
            return (
                <PromoModal
                    showContent={true}
                    isOpen={this.props.showPromoModal}
                    promoCode={this.props.promoCode}
                    promosList={this.props.promosList}
                    minMsgSkusToSelect={this.props.minMsgSkusToSelect}
                    maxMsgSkusToSelect={this.props.maxMsgSkusToSelect}
                    instructions={this.props.instructions}
                    location={this.props.location}
                    successCallback={this.props.successCallback}
                    promoTitleText={this.props.promoTitleText}
                    promoCategoryTitle={this.props.promoCategoryTitle}
                />
            );
        }

        if (this.props.showColorIQModal) {
            return (
                <ColorIQModal
                    isOpen={this.props.showColorIQModal}
                    callback={this.props.colorIQModalCallback}
                />
            );
        }

        if (this.props.showRewardModal) {
            return (
                <RewardModal
                    showContent={true}
                    isOpen={this.props.showRewardModal}
                />
            );
        }

        if (this.props.showApplyRewardsModal) {
            return (
                <ApplyRewardsModal
                    showContent={true}
                    isOpen={this.props.showApplyRewardsModal}
                    type={this.props.rewardsType}
                    isBopis={this.props.isBopis}
                    cmsInfoModals={this.props.cmsInfoModals}
                />
            );
        }

        if (this.props.showOrderConfirmRewardModal) {
            return (
                <OrderConfirmRewardModal
                    showContent={true}
                    isOpen={this.props.showOrderConfirmRewardModal}
                    rewardList={this.props.rewardList}
                />
            );
        }

        if (this.props.showSocialRegistrationModal) {
            return (
                <SocialRegistrationModal
                    isOpen={this.props.showSocialRegistrationModal}
                    socialRegistrationProvider={this.props.socialRegistrationProvider}
                />
            );
        }

        if (this.props.showSocialReOptModal) {
            return (
                <SocialReOptModal
                    isOpen={this.props.showSocialReOptModal}
                    socialReOptCallback={this.props.socialReOptCallback}
                    cancellationCallback={this.props.socialReOptCancellationCallback}
                />
            );
        }

        if (this.props.showEditFlowModal) {
            return (
                <EditFlowModal
                    isOpen={this.props.showEditFlowModal}
                    title={this.props.editFlowTitle}
                    content={this.props.editFlowContent}
                    biAccount={this.props.biAccount}
                    socialProfile={this.props.socialProfile}
                    saveProfileCallback={this.props.saveProfileCallback}
                />
            );
        }

        if (this.props.showExtendSessionModal && this.props.showEditMyProfileModal) {
            return (
                <React.Fragment>
                    <EditMyProfileModal
                        isOpen={this.props.showEditMyProfileModal}
                        saveBeautyTraitCallBack={this.props.saveBeautyTraitCallBack}
                    />
                    <ExtendSessionModal isOpen={this.props.showExtendSessionModal} />
                </React.Fragment>
            );
        }

        if (this.props.showExtendSessionModal) {
            return <ExtendSessionModal isOpen={this.props.showExtendSessionModal} />;
        }

        if (this.props.showEditMyProfileModal) {
            return (
                <EditMyProfileModal
                    isOpen={this.props.showEditMyProfileModal}
                    saveBeautyTraitCallBack={this.props.saveBeautyTraitCallBack}
                />
            );
        }

        if (this.props.showProductFinderModal) {
            return (
                <ProductFinderModal
                    isOpen={this.props.showProductFinderModal}
                    bccData={this.props.guidedSellingData}
                />
            );
        }

        if (this.props.showShareLoveListLinkModal) {
            return (
                <ShareLoveListLinkModal
                    isOpen={this.props.showShareLoveListLinkModal}
                    loveListName={this.props.loveListName}
                    shareLoveListUrl={this.props.shareLoveListUrl}
                    loveListId={this.props?.loveListId}
                    skuIds={this.props?.skuIds}
                />
            );
        }

        if (this.props.showShareLinkModal) {
            return (
                <ShareLinkModal
                    isOpen={this.props.showShareLinkModal}
                    title={this.props.title}
                    shareUrl={this.props.shareUrl}
                    subTitle={this.props.subTitle}
                    isGallery={this.props.isGallery}
                />
            );
        }

        if (this.props.showOrderCancelationModal) {
            return (
                <OrderCancelationModal
                    isOpen={this.props.showOrderCancelationModal}
                    orderId={this.props.canceledOrderId}
                    selfCancelationReasons={this.props.selfCancelationReasons}
                />
            );
        }

        if (this.props.showFindInStoreModal) {
            return (
                <FindInStoreModal
                    isOpen={this.props.showFindInStoreModal}
                    currentProduct={this.props.currentProduct}
                    zipCode={this.props.zipCode}
                    searchedDistance={this.props.searchedDistance}
                    storesToShow={this.props.storesToShow}
                />
            );
        }

        if (this.props.showFindInStoreMapModal) {
            return (
                <FindInStoreMapModal
                    isOpen={this.props.showFindInStoreMapModal}
                    currentProduct={this.props.currentProduct}
                    selectedStore={this.props.selectedStore}
                    zipCode={this.props.zipCode}
                    searchedDistance={this.props.searchedDistance}
                    storesToShow={this.props.storesToShow}
                    useBackToStoreLink={this.props.useBackToStoreLink}
                    {...this.props}
                />
            );
        }

        if (this.props.showCreditCardPrescreenModal) {
            return (
                <CreditCardPrescreenModal
                    isOpen={this.props.showCreditCardPrescreenModal}
                    {...this.props.response}
                />
            );
        }

        if (this.props.showScanRewardCardModal) {
            return <ScanRewardCardModal isOpen={this.props.showScanRewardCardModal} />;
        }

        if (this.props.showCreditReportDetailsModal) {
            return (
                <CreditReportDetailsModal
                    isOpen={this.props.showCreditReportDetailsModal}
                    {...this.props.content}
                />
            );
        }

        if (this.props.showExtendSessionFailureModal) {
            return <ExtendSessionFailureModal isOpen={this.props.showExtendSessionFailureModal} />;
        }

        if (this.props.showProductMediaZoomModal) {
            return (
                <ProductMediaZoomModal
                    isOpen={this.props.showProductMediaZoomModal}
                    product={this.props.product}
                    index={this.props.index}
                    mediaItems={this.props.mediaItems}
                    isGalleryItem={this.props.isGalleryItem}
                />
            );
        }

        if (this.props.showSimilarProducts) {
            return (
                <SimilarProductsModal
                    isOpen={this.props.showSimilarProducts}
                    productImages={this.props.productImages}
                    brandName={this.props.brandName}
                    recommendedProductIDs={this.props.recommendedProductIDs}
                    productName={this.props.productName}
                    itemId={this.props.itemId}
                    analyticsContext={this.props.analyticsContext}
                    badgeAltText={this.props.badgeAltText}
                    isYouMayAlsoLike={this.props.isYouMayAlsoLike}
                    productId={this.props.productId}
                    analyticsData={this.props.analyticsData}
                    skuId={this.props.skuId}
                />
            );
        }

        if (this.props.showAddressVerificationModal) {
            return (
                <AddressVerificationModal
                    isOpen={this.props.showAddressVerificationModal}
                    verificationType={this.props.verificationType}
                    currentAddress={this.props.currentAddress}
                    recommendedAddress={this.props.recommendedAddress}
                    successCallback={this.props.verificationSuccessCallback}
                    cancelCallback={this.props.verificationCancelCallback}
                />
            );
        }

        if (this.props.showReserveAndPickUpModal) {
            return (
                <ReserveAndPickUpModal
                    isOpen={this.props.showReserveAndPickUpModal}
                    currentProduct={this.props.currentProduct}
                    location={this.props.location}
                    searchedDistance={this.props.searchedDistance}
                    storesToShow={this.props.storesToShow}
                    pickupInsteadModalRef={this.props.pickupInsteadModalRef}
                    disableNonBopisStores={this.props.disableNonBopisStores}
                    disableOutOfStockStores={this.props.disableOutOfStockStores}
                    callback={this.props.reserveAndPickUpModalCallback}
                    mountCallback={this.props.reserveAndPickUpModalMountCallback}
                    cancelCallback={this.props.reserveAndPickUpModalCancelCallback}
                    isRopisSelected={this.props.isRopisSelected}
                />
            );
        }

        if (this.props.showReviewImageModal) {
            return (
                <ReviewImageModal
                    isOpen={this.props.showReviewImageModal}
                    reviewSelected={this.props.reviewSelected}
                    reviewSelectedIndex={this.props.reviewSelectedIndex}
                    productTitle={this.props.reviewProductTitle}
                    reviewUser={this.props.reviewUser}
                    reviewsWithImage={this.props.reviewsWithImage}
                    reviewsReference={this.props.reviewsReference}
                    reviewSelectedPhotoId={this.props.reviewSelectedPhotoId}
                    isFromImageCarousel={this.props.isFromImageCarousel}
                />
            );
        }

        if (this.props.showBeautyTraitsModal) {
            return (
                <BeautyTraitsModal
                    isOpen={this.props.showBeautyTraitsModal}
                    checkStatusCallback={this.props.checkStatusCallback}
                />
            );
        }

        if (this.props.showCreditCardOfferModal) {
            return (
                <CreditCardOfferModal
                    isOpen={this.props.showCreditCardOfferModal}
                    rewardsMessagingABTest={this.props.rewardsMessagingABTest}
                    isBasketPageTest={this.props.isBasketPageTest}
                />
            );
        }

        if (this.props.showProductSamplesModal) {
            return (
                <ProductSamplesModal
                    isOpen={this.props.showProductSamplesModal}
                    mainProductSample={this.props.mainProductSample}
                    productSamples={this.props.productSamples}
                />
            );
        }

        if (this.props.showEditBeautyPreferencesModal) {
            return (
                <EditBeautyPreferencesModal
                    isOpen={this.props.showEditBeautyPreferencesModal}
                    beautyPreferencesToSave={this.props.beautyPreferencesToSave}
                    categorySpecificMasterList={this.props.categorySpecificMasterList}
                    hideSpoke={this.props.hideSpoke}
                />
            );
        }

        if (this.props.showFreeReturnsModal) {
            return <FreeReturnsModal isOpen={this.props.showFreeReturnsModal} />;
        }

        if (this.props.showStoreSwitcherModal) {
            return (
                <StoreSwitcher
                    showStoreDetails={this.props.showStoreDetails ?? true}
                    options={this.props.storeSwitcherOptions}
                    afterCallback={this.props.storeSwitcherAfterCallback}
                    preventDefaultSearchUpdates={this.props.preventDefaultSearchUpdates}
                    okButtonText={this.props.okButtonText}
                    showCancelButton={this.props.showCancelButton}
                    entry={this.props.storeSwitcherEntry}
                />
            );
        }

        if (this.props.showShippingDeliveryLocationModal) {
            return (
                <ShippingDeliveryLocationModal
                    isOpen={this.props.showShippingDeliveryLocationModal}
                    callback={this.props.shippingDeliveryLocationModalCallback}
                    cancelCallback={this.props.shippingDeliveryLocationModalCancelCallback}
                    options={this.props.shippingDeliveryLocationModalOptions}
                    primaryButtonText={this.props.primaryButtonText}
                    sku={this.props.sku}
                />
            );
        }

        if (this.props.showCurbsidePickupCheckinModal) {
            return (
                <CurbsidePickupCheckinModal
                    isOpen={this.props.showCurbsidePickupCheckinModal}
                    isCurbsideAvailable={this.props.isCurbsideAvailable}
                />
            );
        }

        if (this.props.showMarkdownModal) {
            return (
                <MarkdownModal
                    isOpen={this.props.showMarkdownModal}
                    title={this.props.title}
                    text={this.props.text}
                />
            );
        }

        if (this.props.showDeliveryIssueModal) {
            return <DeliveryIssueModal isOpen={this.props.showDeliveryIssueModal} />;
        }

        if (this.props.showConsumerPrivacyModal) {
            if (localeUtils.isUS()) {
                return <ConsumerPrivacyModal isOpen={this.props.showConsumerPrivacyModal} />;
            } else {
                return null;
            }
        }

        if (this.props.showShadeFinderQuizModal) {
            const componentName = locationUtils.isColorIQSpokeEntryPoint() ? COLORIQ_SPOKE_COMPONENT_NAME : this.props.componentName;

            return (
                <ShadeFinderQuiz
                    isOpen={this.props.showShadeFinderQuizModal}
                    currentProduct={this.props.currentProduct}
                    componentName={componentName}
                />
            );
        }

        if (this.props.showAccountDeactivatedModal) {
            return (
                <AccountDeactivatedModal
                    isOpen={this.props.showAccountDeactivatedModal}
                    errorMessage={this.props.errorMessageDeactivatedModal}
                />
            );
        }

        if (this.props.showCloseAccountModal) {
            return <CloseAccountModal isOpen={this.props.showCloseAccountModal} />;
        }

        if (this.props.showCheckPasswordModal) {
            return (
                <CheckPasswordModal
                    isOpen={this.props.showCheckPasswordModal}
                    errorMessages={this.props.checkPasswordErrorMessages}
                />
            );
        }

        if (this.props.showGalleryLightBoxModal) {
            return (
                <GalleryLightBoxModal
                    isOpen={this.props.showGalleryLightBoxModal}
                    activeGalleryItem={this.props.activeGalleryItem}
                    isGalleryCarousel={this.props.isGalleryCarousel}
                    galleryItems={this.props.galleryItems}
                    isPdpCarousel={this.props.isPdpCarousel}
                    sharedItem={this.props.sharedItem}
                />
            );
        }

        if (this.props.showGameInfoModal) {
            return (
                <GameInfoModal
                    isOpen={this.props.showGameInfoModal}
                    copy={this.props.gameInoModalCopy}
                    modalStatus={this.props.gameInfoModalStatus}
                    ctaLabel={this.props.gameInoModalCtaLabel}
                    image={this.props.gameInfoModalImage}
                    title={this.props.gameInfoModalTitle}
                    ctaDisabled={this.props.gameInoModalCtaDisabled}
                    ctaAction={this.props.gameInoModalCtaAction}
                    ctaCallback={this.props.gameInfoModalCtaCallback}
                    dismissCallback={this.props.gameInfoModalDismissCallback}
                    showConfetti={this.props.showGameInfoModalConfetti}
                    description={this.props.gameInfoModalDescription}
                    imagePadding={this.props.gameInfoModalImagePadding}
                    footerBorder={this.props.showGameInfoModalFooterBorder}
                />
            );
        }

        if (this.props.showGalleryLightBoxKebabModal) {
            return (
                <GalleryLightBoxKebabModal
                    isOpen={this.props.showGalleryLightBoxKebabModal}
                    photoId={this.props.photoId}
                    isLoggedInUserPhoto={this.props.isLoggedInUserPhoto}
                />
            );
        }

        if (this.props.showReportContentModal) {
            return (
                <ReportContentModal
                    isOpen={this.props.showReportContentModal}
                    shareReportUrl={this.props.shareReportUrl}
                />
            );
        }

        if (this.props.showSMSSignInModal) {
            return (
                <SMSSignInModal
                    isOpen={this.props.showSMSSignInModal}
                    phoneNumber={this.props.phoneNumber}
                    extraParams={this.props.extraParams}
                />
            );
        }

        if (this.props.showLocationAndStoresModal) {
            return <LocationAndStoresModal isOpen={this.props.showLocationAndStoresModal} />;
        }

        if (this.props.showResetPasswordConfirmationModal) {
            return (
                <ResetPasswordConfirmationModal
                    isOpen={this.props.showResetPasswordConfirmationModal}
                    email={this.props.email}
                />
            );
        }

        if (this.props.showMultipleRougeRewardsModal) {
            return (
                <MultipleRougeRewardsModal
                    isOpen={this.props.showMultipleRougeRewardsModal}
                    availableRougeRewards={this.props.availableRougeRewards}
                />
            );
        }

        if (this.props.showRewardsBazaarModal) {
            return (
                <RewardsBazaarModal
                    isOpen={this.props.showRewardsBazaarModal}
                    analyticsData={this.props.analyticsData}
                    source={this.props.source}
                />
            );
        }

        if (this.props.showFreeSamplesModal) {
            return <FreeSamplesModal isOpen={this.props.showFreeSamplesModal} />;
        }

        if (this.props.showItemSubstitutionModal) {
            return (
                <ItemSubstitutionModal
                    isOpen={this.props.showItemSubstitutionModal}
                    item={this.props.firstChoiceItem}
                />
            );
        }

        if (this.props.showBiCardModal) {
            return (
                <BiCardModal
                    isOpen={this.props.showBiCardModal}
                    profileId={this.props.profileId}
                    onBackBtnClick={this.props.onClickBackButtonBiCardModal}
                />
            );
        }

        if (this.props.showEDPConfirmRsvpModal) {
            return (
                <EDPConfirmRsvpModal
                    isOpen={this.props.showEDPConfirmRsvpModal}
                    eventDisplayName={this.props.eventDisplayName}
                    storeDisplayName={this.props.storeDisplayName}
                    timeSlot={this.props.timeSlot}
                    timeZone={this.props.timeZone}
                    edpInfo={this.props.edpInfo}
                    storeId={this.props.storeId}
                    user={this.props.user}
                />
            );
        }

        if (this.props.showSduAgreementModal) {
            return (
                <SDUAgreementModal
                    isOpen={this.props.showSduAgreementModal}
                    isBopis={this.props.isBopis}
                    canCheckoutPaze={this.props.canCheckoutPaze}
                    isSDUItemInBasket={this.props.isSDUItemInBasket}
                />
            );
        }

        if (this.props.showSDULandingPageModal) {
            return (
                <SDULandingPageModal
                    isOpen={this.props.showSDULandingPageModal}
                    onDismiss={this.props.closeSDULandingPageModal}
                    mediaId={this.props.sduMediaId}
                    skuTrialPeriod={this.props.skuTrialPeriod}
                    isSDUAddedToBasket={this.props.isSDUAddedToBasket}
                    isUserSDUTrialEligible={this.props.isUserSDUTrialEligible}
                    isCanada={this.props.isCanada}
                    skipConfirmationModal={this.props.skipSDUConfirmationModal || false}
                    isUserSDUTrialAllowed={this.props.isUserSDUTrialAllowed}
                    fromChooseOptionsModal={this.props.fromChooseOptionsModal}
                />
            );
        }

        if (this.props.showChooseOptionsModal) {
            const {
                showChooseOptionsModal, product, sku, skuType, error, analyticsContext, pageName
            } = this.props;

            return (
                <ChooseOptionsModal
                    isOpen={showChooseOptionsModal}
                    product={product}
                    currentSku={sku}
                    skuType={skuType}
                    error={error}
                    analyticsContext={analyticsContext}
                    pageName={pageName}
                />
            );
        }

        if (this.props.showGenericErrorModal) {
            const {
                showGenericErrorModal, genericErrorTitle, genericErrorHeader, genericErrorContent, genericErrorCta
            } = this.props;

            return (
                <GenericErrorModal
                    isOpen={showGenericErrorModal}
                    title={genericErrorTitle}
                    header={genericErrorHeader}
                    content={genericErrorContent}
                    cta={genericErrorCta}
                />
            );
        }

        if (this.props.showAlternatePickupPersonModal) {
            return (
                <AlternatePickupPersonModal
                    isOpen={this.props.showAlternatePickupPersonModal}
                    alternatePickupData={this.props.alternatePickupData}
                />
            );
        }

        if (this.props.showPlaceOrderTermsModal) {
            return (
                <PlaceOrderTermsModal
                    isOpen={this.props.showPlaceOrderTermsModal}
                    autoReplenishOnly={this.props.autoReplenishOnly}
                />
            );
        }

        if (this.props.showEmailTypoModal) {
            return (
                <EmailTypoModal
                    isOpen={this.props.showEmailTypoModal}
                    isNewUserFlow={this.props.isNewUserFlow}
                    email={this.props.email}
                    onCancel={this.props.onCancel}
                    onContinue={this.props.onContinue}
                />
            );
        }

        if (this.props.showAutoReplenishProductsModal) {
            return <AutoReplenishProductsModal isOpen={this.props.showAutoReplenishProductsModal} />;
        }

        return null;
    }
}

export default wrapComponent(GlobalModalsWrapper, 'GlobalModalsWrapper', true);
