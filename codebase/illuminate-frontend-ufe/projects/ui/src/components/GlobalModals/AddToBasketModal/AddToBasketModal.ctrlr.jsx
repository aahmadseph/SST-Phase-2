import store from 'store/Store';
import actions from 'actions/Actions';
import AddToBasketActions from 'actions/AddToBasketActions';
import productPageBindings from 'analytics/bindingMethods/pages/productPage/productPageSOTBindings';
import analyticsConstants from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import analyticsUtils from 'analytics/utils';
import BaseClass from 'components/BaseClass';
import BasketMsg from 'components/BasketMsg';
import CheckoutButton from 'components/CheckoutButton/CheckoutButton';
import ConstructorCarousel from 'components/ConstructorCarousel';
import ErrorList from 'components/ErrorList';
import Flag from 'components/Flag/Flag';
import Modal from 'components/Modal/Modal';
import Price from 'components/Product/Price/Price';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import FrequentlyBoughtTogetherImages from 'components/ProductPage/FrequentlyBoughtTogether/FrequentlyBoughtTogetherImages';
import {
    Box, Button, Divider, Grid, Link, Text
} from 'components/ui';
import BasketConstants from 'constants/Basket';
import { CONSTRUCTOR_PODS } from 'constants/constructorConstants';
import React from 'react';
import {
    breakpoints, colors, fontSizes, lineHeights, mediaQueries, modal, space
} from 'style/config';
import { supplementAltTextWithProduct } from 'utils/Accessibility';
import BccUtils from 'utils/BCC';
import { default as BasketUtils, default as basketUtils } from 'utils/Basket';
import DeliveryFrequencyUtils from 'utils/DeliveryFrequency';
import DeliveryOptionsUtils from 'utils/DeliveryOptions';
import ExtraProductDetailsUtils from 'utils/ExtraProductDetailsUtils';
import HelpersUtils from 'utils/Helpers';
import localeUtils from 'utils/LanguageLocale';
import Location from 'utils/Location';
import MediaUtils from 'utils/Media';
import skuUtils from 'utils/Sku';
import userUtils from 'utils/User';
import { wrapComponent } from 'utils/framework';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import replaceSpecialCharacters from 'utils/replaceSpecialCharacters';

const { getLocaleResourceFile, isCanada, isFrench } = localeUtils;
const { ADD_TO_BASKET_TYPES: ADD_BUTTON_TYPE } = BasketUtils;
const { BasketType, DELIVERY_OPTIONS } = BasketConstants;
const { formatPrice, getProp } = HelpersUtils;
const { COMPONENT_NAMES, IMAGE_SIZES } = BccUtils;
const { Media } = MediaUtils;
const { formatFrequencyType } = DeliveryFrequencyUtils;
const { getStringWithTrimmedPrice } = DeliveryOptionsUtils;

const BASKET_EXPIRY = Storage.MINUTES * 15;

const getText = getLocaleResourceFile('components/GlobalModals/AddToBasketModal/locales', 'AddToBasketModal');

const setNextPageData = (text, preferredStoreName, props) => event => {
    productPageBindings.viewBasketAndCheckout({ shippingMethod: props.basketType ? props.basketType : DELIVERY_OPTIONS.STANDARD });
    const smallViewport = !window.matchMedia(breakpoints.smMin).matches;
    let linkDataText = text;

    if (smallViewport) {
        linkDataText = analyticsConstants.LinkData.VIEW_IN_BASKET_BUTTON;
    }

    let pageName;
    const pageType = preferredStoreName
        ? analyticsConstants.PAGE_TYPES.ADD_TO_BASKET_FOR_PICKUP_MODAL
        : analyticsConstants.PAGE_TYPES.ADD_TO_BASKET_MODAL;
    const recentEvent = analyticsUtils.getLastAsyncPageLoadData({ pageType: pageType });

    if (!recentEvent.pageName) {
        // Rebuild modal page name if recentEvent data isn't ready yet
        const { product, sku } = props;
        const world = 'n/a';
        const productId = product?.productDetails?.productId || sku.productId || product?.productId;
        const displayName = product?.productDetails?.displayName || sku.productName || product?.displayName;
        pageName = replaceSpecialCharacters(`${pageType}:${productId}:${world}:*pname=${displayName}`);
    }

    //If user adds a ROPIS item to basket set storage to use Prebasket type.
    if (preferredStoreName) {
        Storage.local.setItem(LOCAL_STORAGE.BASKET_TYPE, AddToBasketActions.BASKET_TYPES.PREBASKET, BASKET_EXPIRY);
    }

    analyticsUtils.setNextPageData({
        pageName: recentEvent.pageName || pageName,
        linkData: 'add to basket modal:' + linkDataText
    });
    store.dispatch(actions.showSimilarProductsModal({ isOpen: false }));
    store.dispatch(actions.showAddToBasketModal({ isOpen: false }));
    Location.navigateTo(event, basketUtils.PAGE_URL);
};

const getSmallLabel = () => {
    return getText('viewAndCheckout');
};

const BasketSubtotalInfo = ({ basket, preferredStoreName }) => {
    const isFR = localeUtils.isFrench();

    if (!basket) {
        return null;
    }

    const basketSubtotal = <b>{getText('basketSubtotal')}</b>;
    const gridProps = {
        ['data-at']: Sephora.debug.dataAt('atb_basket_total'),
        columns: '1fr auto',
        gap: 1,
        marginBottom: [2, 3]
    };

    if (preferredStoreName) {
        const {
            pickupBasket: { itemCount, rawSubTotal }
        } = basket;
        const itemsWord = getText(itemCount > 1 ? 'items' : 'item').toLowerCase();

        return (
            <Grid {...gridProps}>
                <span>
                    {basketSubtotal}
                    {` (${itemCount} ${itemsWord}):`}
                </span>
                <strong>{formatPrice(rawSubTotal)}</strong>
            </Grid>
        );
    } else {
        const { itemCount, subtotal } = basket;
        const itemsWord = getText(itemCount > 1 ? 'items' : 'item').toLowerCase();

        return (
            <Grid {...gridProps}>
                <span>
                    {basketSubtotal}
                    {isFR && <br />}
                    {` (${itemCount} ${itemsWord}):`}
                </span>
                <strong>{formatPrice(subtotal)}</strong>
            </Grid>
        );
    }
};

const DisplayCheckoutButton = ({ preferredStoreName, props }) => {
    const isBopis = preferredStoreName && props.basketType !== BasketType.SameDay;
    const linkName = `add to basket modal:${isBopis ? 'checkout pickup items' : 'checkout shipped items'}`;
    const viewBasketLinkText = 'view basket button';

    return (
        <Grid columns={preferredStoreName ? [1, 1] : [2, 1]}>
            <Button
                block
                data-at={Sephora.debug.dataAt('atb_checkout')}
                href='/basket'
                onClick={setNextPageData(viewBasketLinkText, preferredStoreName, props)}
                variant='secondary'
            >
                {getText('viewBasket')}
            </Button>
            <CheckoutButton
                linkName={linkName}
                isBopis={isBopis}
                block={true}
                isShowCheckoutActive={true}
                variant={ADD_BUTTON_TYPE.SPECIAL}
            />
        </Grid>
    );
};

const SubtotalWithActionButtons = ({ basket, sku, preferredStoreName = null, props }) => {
    const showCheckoutButton = !(localeUtils.isCanada() && !userUtils.isAnonymous());

    return (
        <>
            <BasketSubtotalInfo
                basket={basket}
                preferredStoreName={preferredStoreName}
            />
            {!showCheckoutButton ? (
                <Grid columns={preferredStoreName ? [1, 1] : [2, 1]}>
                    <Button
                        block
                        data-at={Sephora.debug.dataAt('atb_checkout')}
                        href='/basket'
                        onClick={setNextPageData(preferredStoreName ? 'Proceed to Basket button' : 'checkout button', preferredStoreName, props)}
                        variant={ADD_BUTTON_TYPE.SPECIAL}
                    >
                        <Media at='xs'>{getSmallLabel()}</Media>
                        <Media greaterThan='xs'>{getText('viewAndCheckout')}</Media>
                    </Button>
                    <Button
                        block
                        data-at={Sephora.debug.dataAt('atb_continue_shopping')}
                        onClick={requestClose(sku, true)}
                        variant='secondary'
                    >
                        {getText('continue')}
                    </Button>
                </Grid>
            ) : (
                DisplayCheckoutButton({ preferredStoreName, props })
            )}
        </>
    );
};

const fireATBPageLoadTracking = props => {
    const { product, sku, analyticsContext } = props;
    const multiProductStrings = Array.isArray(sku) && sku.map(item => `;${item.skuId};;;;eVar26=${item.skuId}`).join(',');
    const productStrings = Array.isArray(sku) ? multiProductStrings : ';' + sku.skuId + ';;;;eVar26=' + sku.skuId;
    const pageType = props.preferredStoreName
        ? analyticsConstants.PAGE_TYPES.ADD_TO_BASKET_FOR_PICKUP_MODAL
        : analyticsConstants.PAGE_TYPES.ADD_TO_BASKET_MODAL;
    const world = 'n/a';

    const productId = product?.productDetails?.productId || sku?.productId || product?.productId || sku?.primaryProductId;
    const displayName = product?.productDetails?.displayName || sku?.productName || product?.displayName || sku?.name;
    const pageName = Array.isArray(sku)
        ? `${analyticsConstants.PAGE_TYPES.ADD_TO_BASKET_MODAL}:${analyticsConstants.PAGE_TYPES.ADD_ALL_TO_BASKET}:n/a:*`
        : replaceSpecialCharacters(`${pageType}:${productId}:${world}:*pname=${displayName}`);

    const recentEvent = analyticsUtils.getLastAsyncPageLoadData({ pageType: analyticsContext });

    processEvent.process(analyticsConstants.ASYNC_PAGE_LOAD, {
        data: {
            pageName,
            pageDetail: productId,
            previousPageName: recentEvent.pageName || getProp(digitalData, 'page.attributes.sephoraPageInfo.pageName'),
            pageType,
            world,
            productStrings
        }
    });
};

const requestClose = (sku, isContinueShopping) => () => {
    const isReward = skuUtils.isBiReward(sku);

    if (isReward) {
        store.dispatch(actions.showQuickLookModal({ isOpen: false }));
    }

    store.dispatch(actions.showAddToBasketModal({ isOpen: false }));

    if (isContinueShopping) {
        const actionInfo = 'add to basket modal:continue shopping button';
        const linkName = actionInfo;
        const {
            LINK_TRACKING_EVENT,
            PAGE_TYPES: { ADD_TO_BASKET_MODAL }
        } = analyticsConstants;
        const recentEvent = analyticsUtils.getLastAsyncPageLoadData({ pageType: ADD_TO_BASKET_MODAL });
        processEvent.process(LINK_TRACKING_EVENT, {
            data: {
                actionInfo,
                linkName,
                ...recentEvent
            }
        });
    }
};

const getUrgencyCountdownMessage = (sku, product = {}, isSdd = true) => {
    const availabilityStatus = (isSdd ? sku?.actionFlags?.sameDayAvailabilityStatus : sku?.actionFlags?.availabilityStatus) || {};

    if (!availabilityStatus) {
        return {};
    }

    const availabilityLabel = ExtraProductDetailsUtils.availabilityLabel(availabilityStatus);
    const availabilityText = getText(availabilityLabel);
    const locationText = userUtils.getZipCode();
    const urgencyMessage = isSdd ? getStringWithTrimmedPrice(sku?.sameDayDeliveryMessage) : product?.pickupMessage || '';

    return { availabilityText, locationText, urgencyMessage };
};

class AddToBasketModal extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            basket: null,
            itemLevelMessages: [],
            hideSampleAndRewardsOnATB: isCanada()
        };
    }

    handleSuccess = () => {
        store.dispatch(actions.showAddToBasketModal({ isOpen: false }));
    };

    /* eslint-disable-next-line complexity */
    render() {
        const {
            basketType = BasketType.Standard,
            preferredStoreName,
            product,
            qty,
            sku,
            replenishmentFrequency,
            replenishmentSelected,
            isAutoReplenMostCommon
        } = this.props;
        const { basket, isBopisStore, hideSampleAndRewardsOnATB } = this.state;

        let headerTitleText = '';

        if (preferredStoreName) {
            headerTitleText = getText('reserveTitle', [preferredStoreName]);
        } else {
            if (basketType === BasketType.SameDay) {
                headerTitleText = getText('sddTitle');
            } else if (replenishmentSelected) {
                headerTitleText = getText('autoReplenishTitle');
            } else {
                headerTitleText = getText('standardTitle');
            }
        }

        let brandName;

        if (product?.productDetails?.brand) {
            brandName = product.productDetails.brand.displayName;
        } else if (sku.brandName) {
            brandName = sku.brandName;
        }

        let replenishmentType = '';
        let replenishmentNum = '';

        if (replenishmentFrequency) {
            [replenishmentType = '', replenishmentNum = ''] = replenishmentFrequency.split(':');
        }

        const isSdd = basketType === BasketType.SameDay;
        const isBopis = preferredStoreName && !isSdd;

        let urgencyCountdownMessage = {};

        if (isSdd) {
            urgencyCountdownMessage = getUrgencyCountdownMessage(sku);
        } else if (isBopis) {
            urgencyCountdownMessage = getUrgencyCountdownMessage(sku, product, false);
        }

        const { availabilityText, locationText, urgencyMessage } = urgencyCountdownMessage;
        const REPLENISHMENT_FREQ_MONTH = 'Months';
        const displayCount = Sephora.isDesktop() ? 4 : 2;
        const showUrgencyMessaging = userUtils.isAnonymous() && sku?.isOnlyFewLeft;
        const productId = product?.productDetails?.productId || sku?.productId || product?.productId;
        const params = { itemIds: productId };
        const frequencyTypeADA =
            replenishmentType === REPLENISHMENT_FREQ_MONTH ? (
                <>
                    <Text
                        is='span'
                        aria-hidden
                    >
                        {getText('monthsShort')}
                    </Text>
                    <Text
                        css={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}
                        is='span'
                    >
                        {getText('months')}
                    </Text>
                </>
            ) : (
                <>
                    <Text
                        is='span'
                        aria-hidden
                    >
                        {getText('weeksShort')}
                    </Text>
                    <Text
                        css={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}
                        is='span'
                    >
                        {getText('weeks')}
                    </Text>
                </>
            );

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={requestClose(sku, false)}
                dataAt={Sephora.debug.dataAt('atb_modal')}
                width={3}
                hasBodyScroll={true}
            >
                <Modal.Header>
                    <Modal.Title>{headerTitleText}</Modal.Title>
                </Modal.Header>
                <Modal.Body lineHeight='tight'>
                    <Grid
                        columns={[null, '1fr 240px']}
                        gap={[0, 6]}
                    >
                        {!this.props.sku.length > 0 ? (
                            <Grid
                                gap={2}
                                columns='auto 1fr'
                            >
                                <ProductImage
                                    disableLazyLoad={true}
                                    id={sku.skuId}
                                    size={IMAGE_SIZES[97]}
                                    skuImages={sku.skuImages}
                                    altText={supplementAltTextWithProduct(sku, product)}
                                />
                                <Grid
                                    gap={2}
                                    columns={['1fr auto', 1]}
                                >
                                    <div>
                                        <div
                                            css={{ fontWeight: 'var(--font-weight-bold)' }}
                                            data-at={Sephora.debug.dataAt('atbmodal_brand')}
                                            children={brandName}
                                        />
                                        <div
                                            data-at={Sephora.debug.dataAt('atbmodal_name')}
                                            children={product?.productDetails ? product.productDetails.displayName : sku.productName || sku?.name}
                                        />
                                        <Box
                                            marginTop={1}
                                            fontSize='sm'
                                            data-at={Sephora.debug.dataAt('atb_product_info')}
                                            color='gray'
                                        >
                                            {getText('item')} {sku.skuId}
                                            <Text marginX={2}>•</Text>
                                            {getText('qty')} {qty}
                                        </Box>
                                        <ProductVariation
                                            fontSize='sm'
                                            marginTop={1}
                                            product={product}
                                            sku={sku}
                                        />
                                        {replenishmentSelected && (
                                            <Text
                                                is='p'
                                                marginTop={2}
                                                fontSize='sm'
                                            >
                                                <Text
                                                    is='span'
                                                    role='text'
                                                >
                                                    {getText('deliverEvery')}{' '}
                                                    <strong>
                                                        {replenishmentNum}{' '}
                                                        {isAutoReplenMostCommon && !Sephora.isMobile()
                                                            ? frequencyTypeADA
                                                            : formatFrequencyType(replenishmentNum, replenishmentType)}
                                                        {isAutoReplenMostCommon && ` (${getText('mostCommon')})`}
                                                    </strong>
                                                </Text>
                                            </Text>
                                        )}
                                        {isSdd && (
                                            <>
                                                <Text
                                                    is='p'
                                                    marginBottom='2px'
                                                    marginTop='4px'
                                                >
                                                    <Text
                                                        fontWeight={'bold'}
                                                        color={'green'}
                                                        children={availabilityText}
                                                    />
                                                    {` ${getText('for')} `}
                                                    <Text
                                                        padding={2}
                                                        margin={-2}
                                                        fontWeight='bold'
                                                        children={locationText}
                                                    ></Text>
                                                </Text>
                                                <Text
                                                    is='p'
                                                    marginBottom='-2px'
                                                    color='green'
                                                    fontSize='sm'
                                                    children={urgencyMessage}
                                                />
                                            </>
                                        )}
                                        {isBopis && (
                                            <>
                                                <Text
                                                    is='p'
                                                    marginBottom='4px'
                                                    marginTop='4px'
                                                    fontSize='sm'
                                                >
                                                    <Text
                                                        fontWeight={'bold'}
                                                        color={'green'}
                                                        children={availabilityText}
                                                    />
                                                    {` ${getText('at')} `}
                                                    <Text
                                                        padding={2}
                                                        margin={-2}
                                                        fontWeight='bold'
                                                        children={preferredStoreName}
                                                    ></Text>
                                                </Text>
                                                <Text
                                                    is='p'
                                                    color='green'
                                                    fontSize='sm'
                                                    children={urgencyMessage}
                                                />
                                            </>
                                        )}
                                        {showUrgencyMessaging && (
                                            <Flag
                                                children={getText('urgencyMessage')}
                                                width={isFrench() ? 'auto' : 'max-content'}
                                                isLarge={true}
                                                marginTop={2}
                                                backgroundColor={'red'}
                                                marginRight={1}
                                            />
                                        )}
                                        {this.state.itemLevelMessages && (
                                            <ErrorList
                                                marginTop={2}
                                                marginBottom={null}
                                                errorMessages={this.state.itemLevelMessages}
                                            />
                                        )}
                                    </div>
                                    <Price
                                        textAlign={['right', 'left']}
                                        atPrefix='atb_product'
                                        sku={sku}
                                        replenishmentSelected={replenishmentSelected}
                                    />
                                </Grid>
                            </Grid>
                        ) : (
                            <FrequentlyBoughtTogetherImages
                                sku={sku}
                                product={product}
                            />
                        )}
                        <Box display={['none', 'block']}>
                            <SubtotalWithActionButtons
                                basket={basket}
                                isBopisStore={isBopisStore}
                                preferredStoreName={preferredStoreName}
                                props={this.props}
                                sku={sku}
                            />
                        </Box>
                    </Grid>
                    {!preferredStoreName && (
                        <>
                            {basket && !preferredStoreName && !hideSampleAndRewardsOnATB && (
                                <>
                                    <Divider
                                        marginTop={5}
                                        marginBottom={[3, 4]}
                                        marginX={modal.outdentX}
                                    />
                                    <Grid
                                        textAlign={[null, 'center']}
                                        gap={[3, 5]}
                                        columns={[null, '1fr 1px 1fr']}
                                    >
                                        <p
                                            css={{ alignSelf: 'center' }}
                                            data-at={Sephora.debug.dataAt('add_to_basket_modal_message')}
                                        >
                                            {getText('seeSamples')}{' '}
                                            <Link
                                                key='basketLink'
                                                display='inline'
                                                color='blue'
                                                underline={true}
                                                onClick={setNextPageData('basket link', null, this.props)}
                                                href='/basket'
                                                children={getText('basket')}
                                            />
                                            .
                                        </p>
                                        <Media greaterThan='xs'>
                                            <Box
                                                height='100%'
                                                borderLeft={1}
                                                borderColor='divider'
                                            />
                                        </Media>
                                        <Media lessThan='sm'>
                                            <Divider marginX={modal.outdentX} />
                                        </Media>
                                        <BasketMsg />
                                    </Grid>
                                </>
                            )}
                            {productId ? (
                                <ConstructorCarousel
                                    params={params}
                                    podId={CONSTRUCTOR_PODS.ATB}
                                    showPrice
                                    showReviews={true}
                                    showLoves
                                    skuImageSize={IMAGE_SIZES[97]}
                                    showTouts={false}
                                    showArrows
                                    gutter={space[3]}
                                    titleMargin='0'
                                    formatValuePrice={true}
                                    titleStyle={{
                                        fontSize: fontSizes.md,
                                        fontWeight: 'var(--font-weight-bold)',
                                        lineHeight: lineHeights.tight,
                                        marginBottom: space[3],
                                        textAlign: 'center',
                                        [mediaQueries.sm]: {
                                            marginBottom: space[5]
                                        }
                                    }}
                                    contextStyle={{
                                        borderTopWidth: 1,
                                        borderColor: colors.divider,
                                        marginTop: space[3],
                                        marginLeft: -modal.paddingX[0],
                                        marginRight: -modal.paddingX[0],
                                        paddingLeft: modal.paddingX[0],
                                        paddingRight: modal.paddingX[0],
                                        paddingTop: space[3],
                                        [mediaQueries.sm]: {
                                            marginTop: space[4],
                                            paddingTop: space[5],
                                            marginLeft: -modal.paddingX[1],
                                            marginRight: -modal.paddingX[1],
                                            paddingLeft: modal.paddingX[1],
                                            paddingRight: modal.paddingX[1]
                                        }
                                    }}
                                    displayCount={displayCount}
                                    showMarketingFlags
                                    componentType={COMPONENT_NAMES.CAROUSEL}
                                    analyticsContext={analyticsConstants.PAGE_TYPES.ADD_TO_BASKET_MODAL}
                                />
                            ) : null}
                        </>
                    )}
                    {preferredStoreName && (
                        <Media at='xs'>
                            <Divider
                                marginTop={6}
                                marginBottom={5}
                                marginX={modal.outdentX}
                            />
                            <SubtotalWithActionButtons
                                basket={basket}
                                isBopisStore={isBopisStore}
                                preferredStoreName={preferredStoreName}
                                props={this.props}
                                sku={sku}
                            />
                        </Media>
                    )}
                </Modal.Body>
                {!preferredStoreName && (
                    <Modal.Footer display={[null, 'none']}>
                        <SubtotalWithActionButtons
                            basket={basket}
                            props={this.props}
                            sku={sku}
                        />
                    </Modal.Footer>
                )}
            </Modal>
        );
    }

    getModalItemMessages = basketItems => {
        basketItems.forEach(item => {
            if (item.sku.skuId === this.props.sku.skuId && item.itemLevelMessages) {
                this.setState({
                    itemLevelMessages: item.itemLevelMessages.reduce((acc, msgContainer) => acc.concat(msgContainer.messages), [])
                });
            }
        });
    };

    componentDidMount() {
        store.setAndWatch('basket', this, null, true);

        const prefix = this.props.basketType === BasketType.BOPIS ? '.pickupBasket' : '';
        store.setAndWatch(`basket${prefix}.items`, this, value => {
            const basketItems = getProp(value, 'items');

            if (basketItems) {
                this.getModalItemMessages(basketItems);
            }
        });

        store.setAndWatch('user.preferredStoreInfo', this, storeInfo => {
            const { preferredStoreInfo } = storeInfo;
            this.setState({
                isRopisStore: preferredStoreInfo?.isRopisable,
                isBopisStore: preferredStoreInfo?.isBopisable
            });
        });
        fireATBPageLoadTracking(this.props);
    }
}

export default wrapComponent(AddToBasketModal, 'AddToBasketModal', true);
