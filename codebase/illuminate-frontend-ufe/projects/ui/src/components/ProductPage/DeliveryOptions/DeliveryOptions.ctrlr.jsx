/* eslint-disable complexity */

import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Grid } from 'components/ui';
import ExpandableDeliveryOptions from 'components/ProductPage/DeliveryOptions/ExpandableDeliveryOptions';
import GetItShipped from 'components/ProductPage/DeliveryOptions/GetItShipped';
import BOPIS from 'components/ProductPage/DeliveryOptions/BOPIS';
import SameDayDelivery from 'components/ProductPage/DeliveryOptions/SameDayDelivery';
import AutoReplenishment from 'components/ProductPage/DeliveryOptions/AutoReplenishment';
import deliveryOptionsUtils from 'utils/DeliveryOptions';
import basketConstants from 'constants/Basket';
import anaConsts from 'analytics/constants';
import bccUtils from 'utils/BCC';
import processEvent from 'analytics/processEvent';
import localeUtils from 'utils/LanguageLocale';

const isCanada = localeUtils.isCanada();
const {
    US_SHIPPING_INFO, ROPIS_INFO, CA_SHIPPING_INFO, BOPIS_INFO, SAME_DAY_DELIVERY_INFO, AUTO_REPLENISHMENT
} = bccUtils.MEDIA_IDS;
const { showStoreListModal } = deliveryOptionsUtils;
const { DELIVERY_OPTIONS } = basketConstants;

class DeliveryOptions extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            sameDayAvailable: true,
            renderSDULandingPage: false,
            isUserSDUTrialAllowed: false,
            selectedDeliveryOption: props.selectedDeliveryOption || DELIVERY_OPTIONS.STANDARD
        };

        this.showStoreListModal = showStoreListModal.bind(this);
    }

    componentDidMount() {
        const { reorderFulfillmentOptionsPdp, deliveryOptions } = this.props;

        if (this.props.shouldSelectAutoReplenish && this.state.selectedDeliveryOption !== DELIVERY_OPTIONS.AUTO_REPLENISH) {
            this.setSelectedDeliveryOption(DELIVERY_OPTIONS.AUTO_REPLENISH);
        }

        if (reorderFulfillmentOptionsPdp && !deliveryOptions?.[0]?.disabled) {
            this.setSelectedDeliveryOption(DELIVERY_OPTIONS.PICKUP);
        }
    }

    componentDidUpdate(prevProps, _state) {
        const { reorderFulfillmentOptionsPdp, deliveryOptions } = this.props;
        const autoReplenishIndex = reorderFulfillmentOptionsPdp ? 2 : 1;

        if (prevProps.deliveryOptions?.[autoReplenishIndex]?.disabled !== this.props.deliveryOptions?.[autoReplenishIndex]?.disabled) {
            this.shouldAutoReplenBeSelected();
        }

        // Reset options on SPA page loads
        if (prevProps.currentProduct?.productDetails?.productId !== this.props.currentProduct?.productDetails?.productId) {
            const shouldSelectBopis = !deliveryOptions?.[0]?.disabled && reorderFulfillmentOptionsPdp;
            this.setSelectedDeliveryOption(shouldSelectBopis ? DELIVERY_OPTIONS.PICKUP : DELIVERY_OPTIONS.STANDARD);
        }

        if (
            prevProps.reorderFulfillmentOptionsPdp !== reorderFulfillmentOptionsPdp &&
            reorderFulfillmentOptionsPdp &&
            !deliveryOptions?.[0]?.disabled
        ) {
            this.setSelectedDeliveryOption(DELIVERY_OPTIONS.PICKUP);
        }
    }

    shouldAutoReplenBeSelected = () => {
        if (this.state.selectedDeliveryOption === DELIVERY_OPTIONS.AUTO_REPLENISH) {
            const isAutoReplenishDisabled = this.props.deliveryOptions.find(deliveryOption =>
                Boolean(deliveryOption.deliveryOption === DELIVERY_OPTIONS.AUTO_REPLENISH && deliveryOption.disabled)
            );

            if (isAutoReplenishDisabled) {
                // If autoreplen is disabled, select standard shipping again
                this.props.resetGetItShipped(() => this.setSelectedDeliveryOption(DELIVERY_OPTIONS.STANDARD));
            }
        }
    };

    fireAnalytics = (bccMediaSpec, isUserSDUTrialAllowed = false, isSDUAddedToBasket = false) => {
        let pageDetail;
        let linkData;
        let pageType;

        if (bccMediaSpec.type === 'information') {
            pageDetail = anaConsts.PAGE_DETAIL.BCC_INFORMATION_MODAL;
            linkData = anaConsts.LinkData.VIEW_INFORMATION_ICON;
            pageType = anaConsts.PAGE_TYPES.ROPIS;

            if (bccMediaSpec.info === 'bopisStore') {
                pageType = anaConsts.PAGE_TYPES.BOPIS;
            }
        }

        if (bccMediaSpec.type === 'shipping') {
            pageDetail = anaConsts.PAGE_DETAIL.SHIPPING_INFORMATION + (isCanada ? ' (canada)' : ' (us)');
            linkData = anaConsts.LinkData.VIEW_SHIPPING_AND_RETURNS;
            pageType = anaConsts.PAGE_TYPES.CONTENT_STORE;
        }

        if (bccMediaSpec.type === 'shipping-estimate') {
            pageDetail = anaConsts.PAGE_DETAIL.ESTIMATED_SHIPPING_INFORMATION;
            pageType = anaConsts.PAGE_TYPES.SHIPPING;
        }

        if (bccMediaSpec.info === 'autoReplenish') {
            linkData = anaConsts.LinkData.AUTO_REPLENISH;
            pageType = anaConsts.PAGE_TYPES.AUTO_REPLENISH;
            pageDetail = anaConsts.PAGE_DETAIL.SUBSCRIPTION_INFO;
        }

        if (bccMediaSpec === 'SDULandingPage') {
            pageType = anaConsts.PAGE_NAMES.SAME_DAY_UNLIMITED;

            if (isUserSDUTrialAllowed) {
                if (isSDUAddedToBasket) {
                    pageDetail = anaConsts.PAGE_TYPES.TRIAL_ALREADY_ADDED;
                } else {
                    pageDetail = anaConsts.PAGE_TYPES.TRIAL_OFFER;
                }
            } else {
                if (isSDUAddedToBasket) {
                    pageDetail = anaConsts.PAGE_TYPES.SUBSCRIPTION_ALREADY_ADDED;
                } else {
                    pageDetail = anaConsts.PAGE_TYPES.SUBSCRIPTION_OFFER;
                }
            }
        }

        const data = {
            pageName: `${pageType}:${pageDetail}:n/a:*`,
            pageType,
            pageDetail,
            linkData
        };

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data });
    };

    showBCCMediaModal = (event, bccMediaSpec = {}) => {
        event?.preventDefault();
        event?.stopPropagation();

        let mediaId;
        let titleDataAt;

        if (bccMediaSpec.type === 'information') {
            mediaId = ROPIS_INFO;
            titleDataAt = 'informationModalTitle';

            if (bccMediaSpec.info === 'bopisStore') {
                mediaId = BOPIS_INFO;
            }

            if (bccMediaSpec.info === 'sameDay') {
                mediaId = SAME_DAY_DELIVERY_INFO;
                titleDataAt = 'sameDayDeliveryModalTitle';
            }

            if (bccMediaSpec.info === 'autoReplenish') {
                mediaId = AUTO_REPLENISHMENT;
                titleDataAt = 'autoReplenishModalTitle';
            }
        }

        if (bccMediaSpec.type === 'shipping') {
            mediaId = isCanada ? CA_SHIPPING_INFO : US_SHIPPING_INFO;
            titleDataAt = 'shippingHandlingModalTitle';
        }

        this.props.showMediaModal({
            isOpen: true,
            mediaId,
            titleDataAt
        });

        this.fireAnalytics(bccMediaSpec);
    };

    onClickAnalytics = (event, params = {}) => {
        event?.preventDefault();
        event?.stopPropagation();

        const { bccSpecInfo } = params;
        this.fireAnalytics(bccSpecInfo);
    };

    setSelectedDeliveryOption = selectedDeliveryOption => {
        const { reserveAndPickupClick, getItShippedClick, sameDayDeliveryClick, autoReplenishClick } = this.props;

        // Make sure auto replen is unselected before any other delivery option is selected.
        // Auto replen should be selected only when standard shipping is selected
        autoReplenishClick(false);

        switch (selectedDeliveryOption) {
            case DELIVERY_OPTIONS.PICKUP:
                reserveAndPickupClick();

                break;
            case DELIVERY_OPTIONS.STANDARD:
                getItShippedClick();

                break;

            case DELIVERY_OPTIONS.AUTO_REPLENISH:
                getItShippedClick();
                autoReplenishClick(true);

                break;

            case DELIVERY_OPTIONS.SAME_DAY:
                sameDayDeliveryClick(this.state.sameDayAvailable);

                break;
            default:
                break;
        }

        this.setState({ selectedDeliveryOption });
    };

    toggleSDULandingPage = () => {
        if (this.props.fromChooseOptionsModal) {
            deliveryOptionsUtils.showSDULandingPageModal({
                isOpen: true,
                mediaId: this.props.sduMediaId,
                skuTrialPeriod: this.props.skuTrialPeriod,
                isSDUAddedToBasket: this.props.isSDUAddedToBasket,
                isUserSDUTrialEligible: this.props.isUserSduTrialEligible,
                isCanada: this.props.isCanada,
                skipConfirmationModal: true,
                isUserSDUTrialAllowed: this.state.isUserSDUTrialAllowed,
                fromChooseOptionsModal: this.props.fromChooseOptionsModal
            });
        } else {
            this.setState(
                {
                    renderSDULandingPage: !this.state.renderSDULandingPage
                },
                () => {
                    if (this.state.renderSDULandingPage) {
                        this.fireAnalytics('SDULandingPage', this.state.isUserSDUTrialAllowed, this.props.isSDUAddedToBasket);
                        this.props.triggerModalOpenAnalytics && this.props.triggerModalOpenAnalytics(this.props.isSDUAddedToBasket);
                    }
                }
            );
        }
    };

    renderDeliveryOption = (option, isSelected) => {
        const {
            currentProduct,
            shippingMethodNotAvailable,
            serviceUnavailable,
            sameDayNotAvailableForZip,
            autoReplenProductEligibility,
            isReplenishmentEligible,
            showAutoReplenishment,
            quantity,
            isUserSduTrialEligible,
            sameDayAvailable,
            sameDayDeliveryClick,
            getItShippedClick,
            replenishmentFreqNum,
            autoReplenishChecked,
            isAutoReplenMostCommon,
            replenishmentFreqType,
            openDeliveryFrequencyModal,
            isSDUAddedToBasket,
            skuTrialEligibility,
            skuTrialPeriod,
            displayOrderCutoffCountdown,
            reserveAndPickupClick,
            sameDayDelivery,
            fromChooseOptionsModal
        } = this.props;

        switch (option.deliveryOption) {
            case DELIVERY_OPTIONS.STANDARD:
                return (
                    <GetItShipped
                        currentProduct={currentProduct}
                        currentSku={currentProduct?.currentSku}
                        shippingMethodNotAvailable={shippingMethodNotAvailable}
                        serviceUnavailable={serviceUnavailable}
                        sameDayNotAvailableForZip={sameDayNotAvailableForZip}
                        autoReplenProductEligibility={autoReplenProductEligibility}
                        isReplenishmentEligible={isReplenishmentEligible}
                        showAutoReplenishment={showAutoReplenishment}
                        quantity={quantity}
                        isUserSduTrialEligible={isUserSduTrialEligible}
                        showBCCMediaModal={this.showBCCMediaModal}
                        onClickAnalytics={this.onClickAnalytics}
                        sameDayDeliveryClick={getItShippedClick}
                        fromChooseOptionsModal={this.props.fromChooseOptionsModal}
                    />
                );
            case DELIVERY_OPTIONS.SAME_DAY:
                return (
                    <SameDayDelivery
                        currentProduct={currentProduct}
                        sameDayNotAvailableForZip={sameDayNotAvailableForZip}
                        sameDayAvailable={sameDayAvailable}
                        sameDayDelivery={sameDayDelivery}
                        sameDayDeliveryClick={sameDayDeliveryClick}
                        serviceUnavailable={serviceUnavailable}
                        showBCCMediaModal={this.showBCCMediaModal}
                        bccMediaSpecInfo={option.bccMediaSpecInfo}
                        displayOrderCutoffCountdown={displayOrderCutoffCountdown}
                        isSDUAddedToBasket={isSDUAddedToBasket}
                        skuTrialEligibility={skuTrialEligibility}
                        skuTrialPeriod={skuTrialPeriod}
                        toggleSDULandingPage={this.toggleSDULandingPage}
                        renderSDULandingPage={this.state.renderSDULandingPage}
                        isUserSDUTrialEligible={isUserSduTrialEligible}
                        fromChooseOptionsModal={this.props.fromChooseOptionsModal}
                    />
                );
            case DELIVERY_OPTIONS.PICKUP:
                return (
                    <BOPIS
                        currentProduct={fromChooseOptionsModal ? currentProduct : option.currentProduct}
                        preferredStoreInfo={option.preferredStoreInfo}
                        reserveAndPickupClick={reserveAndPickupClick}
                        showStoreListModal={this.showStoreListModal}
                        disabledText={option.disabled && option.subTitle}
                        displayOrderCutoffCountdown={displayOrderCutoffCountdown}
                        showBCCMediaModal={this.showBCCMediaModal}
                        bccMediaSpecInfo={option.bccMediaSpecInfo}
                        isSelected={isSelected}
                        onClickAnalytics={this.onClickAnalytics}
                    />
                );
            case DELIVERY_OPTIONS.AUTO_REPLENISH:
                return (
                    <AutoReplenishment
                        currentProduct={currentProduct}
                        currentSku={currentProduct?.currentSku}
                        autoReplenProductEligibility={autoReplenProductEligibility}
                        isReplenishmentEligible={isReplenishmentEligible}
                        showAutoReplenishment={showAutoReplenishment}
                        quantity={quantity}
                        showBCCMediaModal={this.showBCCMediaModal}
                        replenishmentFreqNum={replenishmentFreqNum}
                        autoReplenishChecked={autoReplenishChecked}
                        isAutoReplenMostCommon={isAutoReplenMostCommon}
                        replenishmentFreqType={replenishmentFreqType}
                        openDeliveryFrequencyModal={openDeliveryFrequencyModal}
                        bccMediaSpecInfo={option.bccMediaSpecInfo}
                        showAutoReplenishmentDetails={false}
                    />
                );
            default:
                return null;
        }
    };

    handleChangeDeliveryOption = option => () => {
        if (!option?.disabled) {
            this.setSelectedDeliveryOption(option.deliveryOption);
        }
    };

    render() {
        const {
            deliveryOptions,
            sddRadioButtonDisabled,
            showBopisSelectorCopyOnPdp,
            hasPickupMessage,
            signInText,
            forFreeShippingText,
            showSignInModal,
            dynamicColumns = false
        } = this.props;
        const { selectedDeliveryOption } = this.state;

        if (typeof digitalData === 'object' && digitalData && digitalData?.page?.attributes) {
            digitalData.page.attributes.isSameDayDeliveryAvailable = !sddRadioButtonDisabled;
        }

        return (
            <Grid
                is='fieldset'
                gap={2}
                lineHeight='tight'
                {...{
                    columns: [null, dynamicColumns ? deliveryOptions.filter(option => !option.hideDeliveryOption).length : 4],
                    marginTop: 4,
                    marginBottom: 4
                }}
            >
                {deliveryOptions.map((option, index) => {
                    const isSelected = selectedDeliveryOption === option.deliveryOption && !option.disabled;

                    return (
                        option.hideDeliveryOption || (
                            <ExpandableDeliveryOptions
                                id={`delivery_option_${index}`}
                                key={`delivery_option_${index}`}
                                header={option.title}
                                smHeader={option.smTitle}
                                subHeader={option.subTitle}
                                smSubHeader={option.smSubTitle}
                                enableMarkdownSubtitle={option.enableMarkdownSubtitle}
                                iconName={option.iconName}
                                deliveryOption={option.deliveryOption}
                                handleChange={this.handleChangeDeliveryOption(option)}
                                selected={isSelected}
                                disabled={option.disabled}
                                showBCCMediaModal={this.showBCCMediaModal}
                                bccMediaSpecInfo={option.bccMediaSpecInfo}
                                showBopisSelectorCopyOnPdp={showBopisSelectorCopyOnPdp}
                                hasPickupMessage={hasPickupMessage}
                                signInText={signInText}
                                forFreeShippingText={forFreeShippingText}
                                showSignInModal={showSignInModal}
                                fromChooseOptionsModal={this.props.fromChooseOptionsModal}
                            >
                                {this.renderDeliveryOption(option, isSelected)}
                            </ExpandableDeliveryOptions>
                        )
                    );
                })}
            </Grid>
        );
    }
}

DeliveryOptions.propTypes = {
    displayOrderCutoffCountdown: PropTypes.bool,
    getItShipped: PropTypes.bool,
    getItShippedClick: PropTypes.func,
    sameDayDelivery: PropTypes.bool,
    sameDayDeliveryClick: PropTypes.func,
    serviceUnavailable: PropTypes.bool,
    sameDayNotAvailableForZip: PropTypes.bool,
    sameDayAvailable: PropTypes.bool,
    currentProduct: PropTypes.object,
    reserveAndPickupClick: PropTypes.func,
    reserveAndPickup: PropTypes.bool,
    autoReplenishClick: PropTypes.func,
    autoReplenishChecked: PropTypes.bool,
    isAutoReplenMostCommon: PropTypes.bool,
    replenishmentFreqNum: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    replenishmentFreqType: PropTypes.string,
    quantity: PropTypes.number,
    openDeliveryFrequencyModal: PropTypes.func,
    isSDUAddedToBasket: PropTypes.bool,
    skuTrialEligibility: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    skuTrialPeriod: PropTypes.string,
    isUserSDUTrialEligible: PropTypes.bool,
    fromChooseOptionsModal: PropTypes.bool,
    selectedDeliveryOption: PropTypes.string
};

export default wrapComponent(DeliveryOptions, 'DeliveryOptions', true);
