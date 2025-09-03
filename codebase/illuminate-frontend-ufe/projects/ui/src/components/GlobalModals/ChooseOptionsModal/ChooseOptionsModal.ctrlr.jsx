import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import Loader from 'components/Loader';
import CallToAction from 'components/ProductPage/CallToAction';
import basketConstants from 'constants/Basket';
import Location from 'utils/Location';
import ProductInfo from 'components/GlobalModals/ChooseOptionsModal/ProductInfo';
import ProductOptions from 'components/GlobalModals/ChooseOptionsModal/ProductOptions';
import FulfillmentSection from 'components/GlobalModals/ChooseOptionsModal/FulfillmentSection';
import ErrorDisplay from 'components/GlobalModals/ChooseOptionsModal/ErrorDisplay';
import chooseOptionsModalUtils from 'utils/ChooseOptionsModal/ChooseOptionsModalUtils';
import StoreSubscriptionManager from 'utils/ChooseOptionsModal/StoreSubscriptionManager';
import { space, shadows, mediaQueries } from 'style/config';
import skuUtils from 'utils/Sku';
import { Text, Link, Box } from 'components/ui';
import Empty from 'constants/empty';

const { BasketType, DELIVERY_OPTIONS } = basketConstants;
const MODAL_WIDTH = 4;

class ChooseOptionsModal extends BaseClass {
    constructor(props) {
        super(props);

        const deliveryOptionState = this.getInitialDeliveryOptionState(props.selectedChooseOptionsDeliveryOption);

        this.state = {
            currentSku: null,
            isSmallView: null,
            showLoader: false,
            productExtraDetailsLoaded: true,
            apiError: '',
            ...deliveryOptionState
        };

        this.subscriptionManager = StoreSubscriptionManager.createInstance();
        this.updateCurrentSku = chooseOptionsModalUtils.createSkuUpdateHandler(this.setState.bind(this));
        this.handleDeliveryOptionChange = this.handleDeliveryOptionChange.bind(this);
    }

    getInitialDeliveryOptionState = selectedDeliveryOption => {
        // If we have a persisted delivery option, use it, otherwise default to Standard shipping
        const defaultOption = selectedDeliveryOption || DELIVERY_OPTIONS.STANDARD;

        return {
            getItShipped: defaultOption === DELIVERY_OPTIONS.STANDARD,
            sameDayDelivery: defaultOption === DELIVERY_OPTIONS.SAME_DAY,
            reserveAndPickup: defaultOption === DELIVERY_OPTIONS.PICKUP
        };
    };

    getSelectedDeliveryOption = () => {
        const { getItShipped, sameDayDelivery, reserveAndPickup } = this.state;

        if (getItShipped) {
            return DELIVERY_OPTIONS.STANDARD;
        } else if (sameDayDelivery) {
            return DELIVERY_OPTIONS.SAME_DAY;
        } else if (reserveAndPickup) {
            return DELIVERY_OPTIONS.PICKUP;
        }

        return DELIVERY_OPTIONS.STANDARD;
    };

    requestCloseOnAddToBasket = event => {
        if (event.detail.isQuickLook) {
            this.props.requestClose && this.props.requestClose();
        }
    };

    openProductPage = event => {
        const { requestClose } = this.props;
        const effectiveCurrentSku = this.getEffectiveCurrentSku();
        this.fireLinkTracking();
        Location.navigateTo(event, effectiveCurrentSku.targetUrl);
        requestClose();
    };

    getEffectiveCurrentSku = () => {
        const { product, currentSku } = this.props;

        return chooseOptionsModalUtils.getEffectiveCurrentSku(this.state.currentSku, currentSku, product);
    };

    handleDeliveryOptionChange = optionTypesObj => {
        this.setState(optionTypesObj);

        const { getItShipped, sameDayDelivery, reserveAndPickup } = optionTypesObj;
        let selectedDeliveryOption = null;

        if (getItShipped) {
            selectedDeliveryOption = DELIVERY_OPTIONS.STANDARD;
        } else if (sameDayDelivery) {
            selectedDeliveryOption = DELIVERY_OPTIONS.SAME_DAY;
        } else if (reserveAndPickup) {
            selectedDeliveryOption = DELIVERY_OPTIONS.PICKUP;
        }

        if (selectedDeliveryOption && this.props.setChooseOptionsDeliveryOption) {
            this.props.setChooseOptionsDeliveryOption(selectedDeliveryOption);
        }
    };

    getSmallView = () => {
        const { product, localization, matchSku, preferredStoreInfo } = this.props;
        const { getItShipped, sameDayDelivery, reserveAndPickup } = this.state;
        const effectiveCurrentSku = this.getEffectiveCurrentSku();
        const selectedDeliveryOption = this.getSelectedDeliveryOption();

        return (
            <>
                <ProductInfo
                    product={product}
                    currentSku={effectiveCurrentSku}
                    localization={localization}
                    onProductPageClick={this.openProductPage}
                    showDescription={false}
                />

                <ProductOptions
                    product={product}
                    currentSku={effectiveCurrentSku}
                    matchSku={matchSku}
                    updateCurrentSku={this.updateCurrentSku}
                    isSmallView={true}
                />

                <FulfillmentSection
                    product={product}
                    currentSku={effectiveCurrentSku}
                    localization={localization}
                    preferredStoreInfo={preferredStoreInfo}
                    getItShipped={getItShipped}
                    sameDayDelivery={sameDayDelivery}
                    reserveAndPickup={reserveAndPickup}
                    selectedDeliveryOption={selectedDeliveryOption}
                    onDeliveryOptionChange={this.handleDeliveryOptionChange}
                />
                {this.getProductDetailsLink(effectiveCurrentSku)}
            </>
        );
    };

    addToBasketCallback = apiError => {
        this.setState({ apiError });

        if (!apiError) {
            this.props.requestClose && this.props.requestClose();
        }
    };

    renderAddToBasketButton = effectiveCurrentSku => {
        const { product, analyticsContext, error, pageName } = this.props;
        const { isSmallView, productExtraDetailsLoaded, reserveAndPickup, sameDayDelivery } = this.state;
        const basketType = reserveAndPickup ? BasketType.BOPIS : sameDayDelivery ? BasketType.SameDay : BasketType.Standard;

        return (
            <CallToAction
                isSmallView={isSmallView}
                addToBasketDataAt='add_to_basket_btn'
                addToBasketDataAtSm='add_to_basket_btn_small_view'
                displayQuantityPickerInATB={true}
                basketType={basketType}
                isSameDayAvailable={effectiveCurrentSku.isSameDayEligibleSku}
                sku={effectiveCurrentSku}
                product={product}
                productExtraDetailsLoaded={productExtraDetailsLoaded}
                loveButton={false}
                addToBasketCallback={this.addToBasketCallback}
                analyticsContext={analyticsContext}
                isChooseOptionsModal={true}
                accountForBottomNav={isSmallView ? false : null}
                stickyError={isSmallView ? error : null}
                pageName={pageName}
            />
        );
    };

    getProductDetailsLink = (currentSku = {}) => {
        const { product, localization, onProductPageClick } = this.props;

        const updatedSku = { ...currentSku, targetUrl: currentSku.targetUrl || product.targetUrl };

        return (
            <Text
                is='p'
                marginTop={[4, 3]}
                marginBottom={[8, 3]}
                fontSize={['sm', 'base']}
                lineHeight={['tight', 'base']}
            >
                <Text
                    display='block'
                    textAlign='left'
                >
                    <Link
                        href={skuUtils.productUrl(product, updatedSku)}
                        onClick={onProductPageClick}
                        color='blue'
                        underline={true}
                        data-ql-product-details
                        ana-before-unload
                        ana-evt='QL-links'
                    >
                        {localization.seeFullDetails}
                    </Link>
                </Text>
            </Text>
        );
    };

    getLargeView = () => {
        const { product, localization, matchSku, preferredStoreInfo } = this.props;
        const { getItShipped, sameDayDelivery, reserveAndPickup } = this.state;
        const effectiveCurrentSku = this.getEffectiveCurrentSku();
        const selectedDeliveryOption = this.getSelectedDeliveryOption();

        return (
            <>
                <ProductInfo
                    product={product}
                    currentSku={effectiveCurrentSku}
                    localization={localization}
                    onProductPageClick={this.openProductPage}
                    showDescription={false}
                />

                <ProductOptions
                    product={product}
                    currentSku={effectiveCurrentSku}
                    matchSku={matchSku}
                    updateCurrentSku={this.updateCurrentSku}
                    isSmallView={false}
                />

                <FulfillmentSection
                    product={product}
                    currentSku={effectiveCurrentSku}
                    localization={localization}
                    preferredStoreInfo={preferredStoreInfo}
                    getItShipped={getItShipped}
                    sameDayDelivery={sameDayDelivery}
                    reserveAndPickup={reserveAndPickup}
                    selectedDeliveryOption={selectedDeliveryOption}
                    onDeliveryOptionChange={this.handleDeliveryOptionChange}
                    onPreferredStoreOrZipChange={this.preferredStoreOrZipChangeHandler}
                />
            </>
        );
    };

    CHOOSE_OPTIONS_MODAL = 'chooseOptionsModal';

    preferredStoreOrZipChangeHandler = () => {
        this.updateProduct();
    };

    updateProduct = () => {
        const {
            product, localization, skuType, analyticsContext, pageName, error
        } = this.props;
        const effectiveCurrentSku = this.getEffectiveCurrentSku();

        this.props
            .getProductDetailsLite(
                product.productId,
                effectiveCurrentSku.skuId,
                {
                    preferredSku: effectiveCurrentSku.skuId
                },
                {}
            )
            .then(updatedProduct => {
                const { currentSku } = updatedProduct;
                const argumentsObj = {
                    isOpen: true,
                    product: updatedProduct,
                    sku: currentSku,
                    skuType,
                    analyticsContext,
                    pageName,
                    error
                };

                this.props.showChooseOptionsModal(argumentsObj);
            })
            .catch(apiError => {
                if (apiError?.errorMessages?.length > 0) {
                    this.props.requestClose();
                    this.props.showGenericErrorModal({ genericErrorTitle: localization.modalTitle });
                }
            });
    };

    componentDidMount() {
        const { currentSku } = this.props?.product || Empty.Object;
        this.props.updateCurrentProduct({ currentSku });
        this.props.getFulfillmentOptions(this.CHOOSE_OPTIONS_MODAL);

        this.setState(chooseOptionsModalUtils.getInitialViewportState());

        this.subscriptionManager.createProductSubscription(this.setState.bind(this));
        this.subscriptionManager.createPreferredStoreSubscription(this.setState.bind(this));

        this.onClose = this.requestCloseOnAddToBasket.bind(this);

        // Dispatch custom event to close InlineLoves if it is open
        const closeInlineLovesEvent = new CustomEvent('closeInlineLoves');
        window.dispatchEvent(closeInlineLovesEvent);

        this.props.setFromChooseOptionsModal(true);
    }

    componentWillUnmount() {
        this.subscriptionManager.unsubscribeAll();
        this.props.setFromChooseOptionsModal(false);
    }

    render() {
        const { isOpen, requestClose, error, localization } = this.props;
        const { isSmallView, showLoader } = this.state;
        const effectiveCurrentSku = this.getEffectiveCurrentSku();

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={requestClose}
                isDrawer={true}
                dataAt='choose_options_modal'
                closeDataAt='choose_options_modal_close'
                width={MODAL_WIDTH}
            >
                <Modal.Header>
                    <Modal.Title>{localization.modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={styles.modalBody}>
                    {!showLoader && (isSmallView ? this.getSmallView() : this.getLargeView())}
                    {showLoader && (
                        <Loader
                            isShown={true}
                            isInline={true}
                            style={{ height: '420px' }}
                        />
                    )}
                </Modal.Body>

                <Modal.Footer style={styles.modalFooter}>
                    {!isSmallView && this.getProductDetailsLink(effectiveCurrentSku)}
                    <Box is='div'>
                        <ErrorDisplay apiError={error} />
                        {this.renderAddToBasketButton(effectiveCurrentSku)}
                    </Box>
                </Modal.Footer>
            </Modal>
        );
    }
}

const styles = {
    modalBody: {
        paddingBottom: 0
    },
    modalFooter: {
        display: 'flex',
        alignItems: 'center',
        padding: `10px ${space[5]}px`,
        boxShadow: shadows.light,
        justifyContent: 'space-between',
        [mediaQueries.sm]: {
            bottom: 0
        }
    }
};

export default wrapComponent(ChooseOptionsModal, 'ChooseOptionsModal', true);
