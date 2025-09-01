/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Box, Container, Divider, Grid, Text, Link, Icon
} from 'components/ui';
import ShipAddressSection from 'components/Checkout/Sections/ShipAddress/Section/ShipAddressSection';
import ItemsInOrder from 'components/Checkout/OrderSummary/ItemsInOrder/ItemsInOrder';
import SubmitComponent from 'components/RichProfile/MyAccount/ReplacementOrder/SubmitComponent.f';
import mediaUtils from 'utils/Media';
import BCC from 'utils/BCC';
import anaConsts from 'analytics/constants';
import replacementOrderBindings from 'analytics/bindingMethods/pages/replacementOrder/replacementOrderBindings';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import UrlUtils from 'utils/Url';
import Chevron from 'components/Chevron';
import errorConstants from 'utils/ErrorConstants';
import bindingMethods from 'analytics/bindingMethods/pages/orderConfirmation/orderConfPageBindings';
import localeUtils from 'utils/LanguageLocale';
import CompactFooter from 'components/Footer/CompactFooter';
import { space, mediaQueries } from 'style/config';
import Logo from 'components/Logo/Logo';
import { globalModals, renderModal } from 'utils/globalModals';

const { Media } = mediaUtils;
const { SHIPPING_AND_HANDLING_INFO } = globalModals;
const { ERROR_KEYS } = errorConstants;
const { trackingEvent } = replacementOrderBindings;

class ReplacementOrder extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            hasUserVerified: false
        };

        this.ncrOrder = {};
    }

    getOrderDetails = orderId => {
        const { getReplacementOrderDetails } = this.props;
        const { originatingOrderId } = this.ncrOrder;
        getReplacementOrderDetails(orderId, originatingOrderId);
    };

    componentDidMount() {
        digitalData.page.category.pageType = anaConsts.PAGE_TYPES.REPLACEMENT_ORDER;
        digitalData.page.pageInfo.pageName = anaConsts.REPLACEMENT_ORDER.SUBMIT_PAGE_ENTER;

        this.ncrOrder = Storage.local.getItem(LOCAL_STORAGE.NCR_ORDER) || {};
        const { replacementOrderId, originatingOrderId } = this.ncrOrder;

        if (replacementOrderId) {
            if (!digitalData.transaction) {
                digitalData.transaction = {};
            }

            digitalData.transaction.replacementOrderID = replacementOrderId;
            digitalData.transaction.originalOrderID = originatingOrderId;

            this.getOrderDetails(replacementOrderId);
            this.props.getAddressBook(true);
            this.props.fetchSamples();
        }
    }

    componentWillReceiveProps(nextProps) {
        const { orderDetails, isOrderExpired, showSessionExpiredModal } = this.props;
        const { originatingOrderId, replacementOrderId } = this.ncrOrder;
        const shippingAddressHasChanged =
            nextProps.orderDetails?.lastUsedShippingAddressId &&
            nextProps.orderDetails?.lastUsedShippingAddressId !== orderDetails?.lastUsedShippingAddressId;
        const orderHasExpired = nextProps.isOrderExpired && !isOrderExpired;

        if (orderHasExpired) {
            showSessionExpiredModal(originatingOrderId);
        }

        if (shippingAddressHasChanged) {
            this.getOrderDetails(replacementOrderId);
        }
    }

    handleSubmit = () => {
        const { submitReplacementOrder, showSessionExpiredModal, orderDetails } = this.props;
        const { originatingOrderId, replacementOrderId } = this.ncrOrder;
        let productStrings;

        const BASKET_EXPIRY = Storage.MINUTES * 5;

        if (orderDetails?.items?.items?.length) {
            productStrings = bindingMethods.getProductStrings(orderDetails.items.items, localeUtils.getCurrentCountry(), orderDetails.items);
        }

        trackingEvent({
            pageType: anaConsts.PAGE_TYPES.REPLACEMENT_ORDER,
            pageName: anaConsts.REPLACEMENT_ORDER.PAGE_NAME,
            pageDetail: anaConsts.REPLACEMENT_ORDER.SUBMIT_PAGE_ENTER,
            actionInfo: anaConsts.REPLACEMENT_ORDER.SUBMIT_EVENT_SOT,
            linkName: anaConsts.REPLACEMENT_ORDER.SUBMIT_EVENT_SOT,
            originalOrderID: originatingOrderId,
            replacementOrderID: replacementOrderId
        });

        submitReplacementOrder(originatingOrderId, replacementOrderId)
            .then(response => {
                Storage.local.removeItem(LOCAL_STORAGE.NCR_ORDER);
                let success = 'false',
                    error = 'false';

                if (response.returnType !== null && response.responseStatus === 200) {
                    success = 'true';
                    Storage.local.setItem(LOCAL_STORAGE.NCR_PRODUCTS_STRING, productStrings, BASKET_EXPIRY);
                } else if (response.errorCode === ERROR_KEYS.NCR_DECLINED || !response.returnType) {
                    success = 'false';
                } else if (response.errorCode === -1 || response.responseStatus !== 200) {
                    error = 'true';
                }

                if (success === 'false') {
                    Storage.local.setItem(LOCAL_STORAGE.NCR_ORDER_ERROR_MESSAGE, response?.errorMessages?.[0], BASKET_EXPIRY);
                }

                UrlUtils.redirectTo(
                    `/profile/MyAccount/replacementOrderStatus?replacementOrderId=${replacementOrderId}&orderId=${originatingOrderId}&success=${success}&error=${error}`
                );
            })
            .catch(error => {
                //Log error for Dynatrace
                // eslint-disable-next-line no-console
                console.error(
                    `SelfService_NCR_Replacement_Order_API:/selfReturn/confirmIRorNCR,c:${error?.errorCode},m:${error?.errorMessages?.[0]}`
                );

                Storage.local.setItem(LOCAL_STORAGE.NCR_ORDER_ERROR_MESSAGE, error?.errorMessages?.[0], BASKET_EXPIRY);

                if (error.errorCode === ERROR_KEYS.INVALID_NCR_ORDER) {
                    showSessionExpiredModal(originatingOrderId);
                } else if (error.errorCode === ERROR_KEYS.NCR_DECLINED) {
                    UrlUtils.redirectTo(
                        `/profile/MyAccount/replacementOrderStatus?replacementOrderId=${replacementOrderId}&orderId=${originatingOrderId}&success=false&error=false`
                    );
                } else {
                    UrlUtils.redirectTo(
                        `/profile/MyAccount/replacementOrderStatus?replacementOrderId=${replacementOrderId}&orderId=${originatingOrderId}&success=false&error=true`
                    );
                }
            });
    };

    getOrderItemsList = isSamples => {
        const { itemsTitle, orderDetails, samplesInOrder, orderItemsWithoutSamples } = this.props;
        const itemsList = isSamples ? samplesInOrder : orderItemsWithoutSamples;
        const itemCount = orderDetails?.items?.itemCount;

        return (
            <Box
                borderBottom={2}
                borderColor='divider'
                paddingBottom={5}
            >
                {!isSamples && (
                    <Text
                        display='block'
                        fontSize='md'
                        fontWeight='bold'
                        marginBottom={4}
                        marginTop={4}
                        children={`${itemsTitle} (${itemCount})`}
                    />
                )}
                <Box padding={4}>
                    {itemsList?.map((item, index) => (
                        <React.Fragment key={item.commerceId}>
                            {index > 0 && <Divider marginY={3} />}
                            <ItemsInOrder
                                isReplacement={true}
                                isReplacementSample={isSamples}
                                isUS={true}
                                item={item}
                                removeItem={this.removeSample}
                            />
                        </React.Fragment>
                    ))}
                </Box>
            </Box>
        );
    };

    removeSample = (e, sku) => {
        const { addRemoveSample } = this.props;
        e.preventDefault();
        addRemoveSample(sku);
    };

    getPriceInfo = priceInfo => {
        const { orderSubtotalPlusTax, shippingAndHandling, oneTimeReplacement, orderTotal } = this.props;

        return (
            <>
                <Box
                    borderBottom={2}
                    paddingBottom={1}
                    paddingTop={5}
                >
                    <Grid
                        gap={2}
                        columns='1fr auto'
                        marginBottom={2}
                    >
                        <span children={orderSubtotalPlusTax} />
                        <Grid
                            textAlign='right'
                            fontWeight='bold'
                            gap={1}
                        >
                            <span key='subtotalPlusTax'>{priceInfo?.orderSubTotalWithTax}</span>
                        </Grid>
                    </Grid>
                    <Grid
                        gap={2}
                        columns='1fr auto'
                        marginBottom={2}
                    >
                        <Link
                            onClick={() => this.openMediaModal()}
                            padding={1}
                            margin={-1}
                        >
                            {shippingAndHandling}
                            <Icon
                                name='infoOutline'
                                size={'1em'}
                                marginLeft={2}
                            />
                        </Link>
                        <strong>{priceInfo?.shippingHandlingFee}</strong>
                    </Grid>
                    <Grid
                        gap={2}
                        columns='1fr auto'
                        marginBottom={2}
                    >
                        <span children={oneTimeReplacement} />
                        <Grid
                            textAlign='right'
                            fontWeight='bold'
                            gap={1}
                        >
                            <span key='oneTimeReplacement'>{`-${priceInfo?.oneTimeReplacementFee}`}</span>
                        </Grid>
                    </Grid>
                </Box>
                <Box
                    paddingBottom={1}
                    paddingTop={1}
                >
                    <Grid
                        gap={2}
                        columns='1fr auto'
                        fontWeight='bold'
                        marginBottom={2}
                        fontSize='md'
                    >
                        <span children={orderTotal} />
                        <Grid
                            textAlign='right'
                            fontWeight='bold'
                            fontSize='md'
                            gap={1}
                        >
                            <span key='orderTotal'>{priceInfo?.orderTotal}</span>
                        </Grid>
                    </Grid>
                </Box>
            </>
        );
    };

    openMediaModal = () => {
        renderModal(this.props.globalModals[SHIPPING_AND_HANDLING_INFO], () => {
            const { isCanada, shippingAndHandling, showMediaModal } = this.props;
            const usShippingMediaId = BCC.MEDIA_IDS.US_SHIPPING_INFO;
            const caShippingMediaId = BCC.MEDIA_IDS.CA_SHIPPING_INFO;

            showMediaModal({
                isOpen: true,
                mediaId: isCanada ? caShippingMediaId : usShippingMediaId,
                title: shippingAndHandling,
                titleDataAt: 'shippingHandlingModalTitle'
            });
        });
    };

    showSamplesModal = () => {
        const { showSampleModal, samples, MAX_SAMPLES_ALLOWED } = this.props;
        const { sampleList } = samples;

        showSampleModal({
            isOpen: true,
            sampleList: sampleList,
            allowedQtyPerOrder: MAX_SAMPLES_ALLOWED,
            analyticsContext: anaConsts.CONTEXT.REPLACEMENT_ORDER
        });
    };

    showSamplesModalLink = () => {
        const { selectSamplesText } = this.props;

        return (
            <Box
                borderBottom={2}
                borderColor='divider'
                paddingBottom={5}
                paddingTop={5}
            >
                <Grid
                    gap={2}
                    columns='1fr auto'
                >
                    <Text
                        fontSize='md'
                        fontWeight='bold'
                        children={selectSamplesText}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            trackingEvent(
                                {
                                    pageName: anaConsts.REPLACEMENT_ORDER.SELECT_SAMPLES_ENTER,
                                    pageType: anaConsts.PAGE_TYPES.REPLACEMENT_ORDER,
                                    pageDetail: anaConsts.REPLACEMENT_ORDER.SELECT_SAMPLES
                                },
                                'asyncPageLoad'
                            );
                            this.showSamplesModal();
                        }}
                    />
                    <Grid
                        textAlign='right'
                        gap={1}
                        paddingTop={1}
                    >
                        <Chevron direction='right' />
                    </Grid>
                </Grid>
            </Box>
        );
    };

    onAddressSelect = addressData => {
        const { updateNcrShippingAddress } = this.props;
        const { replacementOrderId } = this.ncrOrder;
        const payload = {
            ...addressData,
            replacementOrderId
        };

        updateNcrShippingAddress(payload);
    };

    render() {
        const {
            mainTitle,
            shippingAddressTitle,
            deliveryTitle,
            addressList,
            hardGoodShippingGroup,
            deliveryDateString,
            orderDetails,
            samplesInOrder
        } = this.props;

        if (!orderDetails?.header?.orderId) {
            return null;
        }

        const { hasUserVerified } = this.state;

        return (
            <div css={styles.wrap}>
                <header css={styles.head}>
                    <Logo />
                </header>
                <Container paddingX={[3, 4]}>
                    <Box borderBottom={2}>
                        <Text
                            is='h1'
                            fontFamily='serif'
                            fontSize={['lg', 'xl']}
                            marginTop={4}
                            marginBottom={4}
                            children={mainTitle}
                        />
                    </Box>
                    {hardGoodShippingGroup && (
                        <>
                            <Grid
                                gap={[3, null, 5]}
                                columns={[null, null, '1fr 32%']}
                                lineHeight='tight'
                                marginTop={[4, 5]}
                                scrollBehavior='smooth'
                            >
                                <div>
                                    <Box
                                        borderBottom={1}
                                        paddingBottom={5}
                                    >
                                        <Text
                                            display='block'
                                            fontSize='md'
                                            fontWeight='bold'
                                            marginBottom={4}
                                            children={shippingAddressTitle}
                                        />
                                        <ShipAddressSection
                                            shippingAddress={hardGoodShippingGroup.address}
                                            profileAddresses={addressList}
                                            shippingGroupId={hardGoodShippingGroup.shippingGroupId}
                                            isComplete={hardGoodShippingGroup.isComplete}
                                            shippingMethod={hardGoodShippingGroup.shippingMethod}
                                            isNCR={true}
                                            onAddressSelect={this.onAddressSelect}
                                            isReshipOrder={true}
                                        />
                                    </Box>
                                    <div>
                                        <Box
                                            borderBottom={2}
                                            paddingBottom={5}
                                        >
                                            <Text
                                                display='block'
                                                fontSize='md'
                                                fontWeight='bold'
                                                marginBottom={4}
                                                marginTop={4}
                                                children={deliveryTitle}
                                            />
                                            <Text
                                                display='block'
                                                children={hardGoodShippingGroup.shippingMethod.shippingMethodType}
                                            />
                                            <Text
                                                display='block'
                                                marginBottom={4}
                                                children={deliveryDateString}
                                            />
                                        </Box>
                                    </div>
                                    {orderDetails?.items?.itemCount > 0 && this.getOrderItemsList(false)}
                                    {this.showSamplesModalLink()}
                                    {samplesInOrder?.length > 0 && this.getOrderItemsList(true)}
                                    <Media lessThan='md'>{orderDetails?.priceInfo?.orderTotal && this.getPriceInfo(orderDetails?.priceInfo)}</Media>
                                </div>
                                <SubmitComponent
                                    hasUserVerified={hasUserVerified}
                                    onClick={e => this.setState({ hasUserVerified: e.target.checked })}
                                    totalItems={+orderDetails?.items?.itemCount || 0}
                                    priceInfo={orderDetails?.priceInfo}
                                    openMediaModal={this.openMediaModal}
                                    onSubmit={this.handleSubmit}
                                />
                            </Grid>
                        </>
                    )}
                </Container>
                <div css={styles.footer}>
                    <CompactFooter />
                </div>
            </div>
        );
    }
}

const styles = {
    wrap: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
    },
    head: {
        display: 'flex',
        justifyContent: 'center',
        boxShadow: '0 1px 4px 0 var(--color-darken2)',
        paddingTop: space[4],
        paddingBottom: space[4],
        [mediaQueries.md]: {
            paddingTop: space[6],
            paddingBottom: space[6]
        }
    },
    footer: {
        marginBottom: '80px',
        [mediaQueries.md]: {
            marginBottom: 0
        }
    }
};

ReplacementOrder.propTypes = {
    mainTitle: PropTypes.string,
    shippingAddressTitle: PropTypes.string,
    deliveryTitle: PropTypes.string,
    orderDetails: PropTypes.object,
    hardGoodShippingGroup: PropTypes.object,
    promiseDeliveryDate: PropTypes.string,
    submitReplacementOrder: PropTypes.func,
    showSessionExpiredModal: PropTypes.func
};

export default wrapComponent(ReplacementOrder, 'ReplacementOrder', true);
