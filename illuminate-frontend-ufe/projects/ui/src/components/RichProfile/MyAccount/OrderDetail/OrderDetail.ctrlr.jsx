import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { space } from 'style/config';
import { itemWidths } from 'components/Product/ProductListItem/constants';
import reject from 'utils/functions/reject';
import localeUtils from 'utils/LanguageLocale';
import storeUtils from 'utils/Store';
import postCheckoutUtils from 'utils/PostCheckout';
import OrderUtils from 'utils/Order';
import mediaUtils from 'utils/Media';
import {
    Grid, Button, Divider, Container, Icon, Link, Text, Flex, Box, Image
} from 'components/ui';
import OrderShippingGroups from 'components/RichProfile/MyAccount/OrderDetail/OrderShippingGroups';
import PickupOrderStatus from 'components/RichProfile/MyAccount/OrderDetail/PickupOrderStatus/PickupOrderStatus';
import FulfillmentStatus from 'components/OrderConfirmation/FulfillmentStatus';
import StandardAndSddOrderSummary from 'components/RichProfile/MyAccount/OrderDetail/StandardAndSddOrderSummary/StandardAndSddOrderSummary.f';
import OrderTotal from 'components/OrderConfirmation/OrderTotal';
import Modal from 'components/Modal/Modal';
import Barcode from 'components/Barcode/Barcode';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import OrderStatusDisplayName from 'components/RichProfile/MyAccount/OrderDetail/OrderStatusDisplayName/OrderStatusDisplayName';
import Address from 'components/Addresses/Address';
import StatusMessage from 'components/OrderConfirmation/SddSections/SddSection/StatusMessage';
import ReturnLink from 'components/RichProfile/MyAccount/ReturnLink/ReturnLink';
import RichText from 'components/Content/RichText';
import { colors } from 'style/config';
import { CURBSIDE_PICKUP_ID } from 'utils/CurbsidePickup';
import { SDD_ORDER_DETAILS, STANDARD_SHIPPING_ORDER_DETAILS } from 'utils/OrderDetails';
import UrlUtils from 'utils/Url';
import checkoutApi from 'services/api/checkout';
import auth from 'utils/Authentication';
import store from 'store/Store';
import OrderActions from 'actions/OrderActions';
import AddToBasketActions from 'actions/AddToBasketActions';
import Actions from 'actions/Actions';
import orderUtils from 'utils/Order';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import replacementPageBindings from 'analytics/bindingMethods/pages/replacementOrder/replacementOrderBindings';
import * as curbsideConsts from 'utils/CurbsidePickup';
import orderDetailsBindings from 'analytics/bindingMethods/pages/orderDetails/orderDetailsBindings';
import bccUtils from 'utils/BCC';
import { ensureSephoraPrefix } from 'utils/happening';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const { returnLinkClick } = orderDetailsBindings;
const { isConciergePurchaseEnabled } = Sephora?.configurationSettings;

const { Media } = mediaUtils;
const { COMPONENT_NAMES } = bccUtils;
const { ROPIS_CONSTANTS, HEADER_LEVEL_SDD_ORDER_STATUS, HEADER_LEVEL_STANDARD_ORDER_STATUS, getOrderShippingMethod } = orderUtils;
const { BASKET_TYPES } = AddToBasketActions;
const { HEADER_LEVEL_ORDER_STATUS } = ROPIS_CONSTANTS;
const { PROCESSING } = HEADER_LEVEL_ORDER_STATUS;
const {
    ROPIS_CONSTANTS: {
        PICKUP_METHOD_IDS: { CURBSIDE_CONCIERGE },
        ORDER_STATUS: { ACTIVE }
    }
} = orderUtils;

class OrderDetail extends BaseClass {
    state = { hasInitialized: null };

    componentDidMount() {
        const orderId = UrlUtils.getUrlLastFragment();
        const guestEmail = UrlUtils.getParams().guestEmail;
        const CURBSIDE_CHECKIN_FORCE_ACTION = 'curbside_checkin';
        const isCurbsideCheckin = UrlUtils.getParamsByName('action')?.[0] === CURBSIDE_CHECKIN_FORCE_ACTION;

        // Clear storage as a safety check before confirming Split EDD experience availability.
        Storage.local.removeItem(LOCAL_STORAGE.SPLIT_EDD_EXPERIENCE);

        if (orderId) {
            // In COMM-1503, it was asked to add isdeliveryLinkAvailable to Order Details page load. However, if the user is NOT
            // signed in, the ”then” code for getOrderDetails API won't get called and pageLoad event won't get called. We're
            // fixing that edge case here.
            if (store.getState().auth.profileStatus === 0) {
                processEvent.process(anaConsts.PAGE_LOAD);
            }

            checkoutApi
                .getOrderDetails(orderId, guestEmail, false)
                .then(details => {
                    store.dispatch(OrderActions.updateOrder(details));

                    const isdeliveryLinkAvailable = details?.header?.isdeliveryLinkAvailable;

                    store.setAndWatch('order.orderDetails', this, ({ orderDetails = {} }) => {
                        if (details.header.isGuestOrder && guestEmail) {
                            this.setState({
                                hasInitialized: true,
                                guestEmail: guestEmail,
                                ...orderDetails,
                                ...this.getPickupOrderStatus(orderDetails)
                            });
                        } else {
                            auth.requireLoggedInAuthentication().then(() => {
                                const { isReadyToPickUp, isCanceledPickupOrder, ...pickupOrderStatus } = this.getPickupOrderStatus(orderDetails);
                                this.setState({
                                    hasInitialized: true,
                                    isReadyToPickUp,
                                    isCanceledPickupOrder,
                                    ...orderDetails,
                                    ...pickupOrderStatus
                                });

                                if (isReadyToPickUp && isCurbsideCheckin) {
                                    this.openCurbsideModal();
                                }

                                if (isCanceledPickupOrder && isCurbsideCheckin && !isReadyToPickUp) {
                                    this.openCurbsideModal(false);
                                }
                            });
                        }
                    });

                    this.triggerPageLoadAnalytics(details, isdeliveryLinkAvailable);
                })
                .catch(resp => {
                    // Error Handling
                    // eslint-disable-next-line no-console
                    console.log(resp);
                });
        }
    }

    triggerPageLoadAnalytics = (details, isdeliveryLinkAvailable) => {
        const deliveryMethod = OrderUtils.getOrderShippingMethod(details?.header, details?.items);
        const orderItems = details?.items?.items;
        const status = details?.header?.status;
        const basket = {
            itemsByBasket: details?.items?.itemsByBasket,
            pickupBasket: details?.pickup
        };

        digitalData.page.attributes.smsNotificationFlag = details?.header?.smsNotificationFlag;

        digitalData.page.attributes.productStrings = orderDetailsBindings.buildProductString({
            orderItems,
            deliveryMethod,
            basket,
            status
        });

        if (isdeliveryLinkAvailable) {
            digitalData.page.attributes.isdeliveryLinkAvailable = isdeliveryLinkAvailable;
        }

        processEvent.process(anaConsts.PAGE_LOAD);
    };

    handleViewOrderHistoryClick = () => {
        UrlUtils.redirectTo(OrderUtils.getOrderHistoryUrl());
    };

    openCurbsideModal = (isCurbsideAvailable = true) => {
        orderDetailsBindings.hereForCurbsideClick({ orderId: UrlUtils.getUrlLastFragment() });

        store.dispatch(
            Actions.showCurbsidePickupCheckinModal({
                isOpen: true,
                isCurbsideAvailable
            })
        );
    };

    openBarcodeModal = () => {
        digitalData.page.category.pageType = anaConsts.PAGE_TYPES.USER_PROFILE;
        digitalData.page.pageInfo.pageName = anaConsts.PAGE_NAMES.MY_ACCOUNT;
        digitalData.page.attributes.world = digitalData.page.attributes.world || 'n/a';
        const world = digitalData.page.attributes.world;
        const pageType = digitalData.page.category.pageType;
        const pageName = digitalData.page.pageInfo.pageName;
        const extraString = anaConsts.PAGE_NAMES.ORDER_DETAIL;

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                linkData: `${curbsideConsts.CURBSIDE}:${curbsideConsts.SHOW_PICKUP_BARCODE}`,
                pageName: `${pageType}:${pageName}:${world}:*${extraString}`
            }
        });

        this.setState({ showBarcode: true });
    };

    isOrderCanceled = function ({ isSameDayOrder, sameDayOrderStatus }) {
        return isSameDayOrder && sameDayOrderStatus === HEADER_LEVEL_ORDER_STATUS.CANCELED;
    };

    showModal = e => {
        if (e) {
            e.preventDefault();
        }

        store.dispatch(
            Actions.showMediaModal({
                isOpen: true,
                mediaId: '95400017'
            })
        );
    };

    getPickupOrderStatus = function getPickupOrderStatus({ header = {} }) {
        const { isRopisOrder, isBopisOrder, status } = header;
        const isPickupOrder = isRopisOrder || isBopisOrder;

        return {
            isPickedUp: isPickupOrder && status === HEADER_LEVEL_ORDER_STATUS.PICKED_UP,
            isCanceledPickupOrder: isPickupOrder && status === HEADER_LEVEL_ORDER_STATUS.CANCELED,
            isProcessing: isPickupOrder && status === HEADER_LEVEL_ORDER_STATUS.PROCESSING,
            isReadyToPickUp: isPickupOrder && status === HEADER_LEVEL_ORDER_STATUS.READY_FOR_PICK_UP
        };
    };

    getCanceledSDDItems = itemsByBasket => {
        if (!Array.isArray(itemsByBasket)) {
            return null;
        }

        const sameDayItems = itemsByBasket.find(items => items.basketType === BASKET_TYPES.SAMEDAY_BASKET);

        // Server uses British spelling of canceled
        return sameDayItems?.cancelledItems;
    };

    getAutoReplenishItems = itemsByBasket => {
        if (!Array.isArray(itemsByBasket)) {
            return null;
        }

        const isStandardBasketPresent = itemsByBasket.some(items => items.basketType === BASKET_TYPES.STANDARD_BASKET);
        const standardItems = isStandardBasketPresent && itemsByBasket.find(items => items.basketType === BASKET_TYPES.STANDARD_BASKET);

        return standardItems?.items?.filter(item => item.isReplenishment);
    };

    openDeliveryIssueModal = ({ orderId }) => {
        store.dispatch(OrderActions.loadDeliveryIssues());
        //Analytics
        replacementPageBindings.modalLoadTracking({
            pageDetail: anaConsts.PAGE_DETAIL.REPORT_ISSUE_MODAL,
            eventDetail: [anaConsts.Event.REPORT_ISSUE_MODAL],
            orderId
        });
    };

    renderBarcodeModal = orderId => {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/OrderDetail/locales', 'OrderDetail');

        return (
            <Modal
                isOpen={this.state.showBarcode}
                isDrawer={true}
                onDismiss={() => this.setState({ showBarcode: false })}
            >
                <Modal.Header>
                    <Modal.Title>{getText('scan')}</Modal.Title>
                </Modal.Header>
                <Modal.Body textAlign='center'>
                    <Grid
                        marginTop={5}
                        alignItems='center'
                    >
                        <Barcode
                            id={`BP-${orderId}`}
                            code={'CODE128'}
                            border={1}
                        />
                        <Text
                            is='p'
                            data-at='show_pickup_barcode'
                            fontSize='sm'
                            lineHeight='none'
                            color='gray'
                            marginTop={5}
                            children={getText('show')}
                        />
                        <Text
                            is='p'
                            data-at='pickup_order_number'
                            fontSize='md'
                            lineHeight='none'
                            marginBottom={2}
                            fontWeight={'bold'}
                            children={`${getText('pickUpOrderNumber')}: ${orderId}`}
                        />
                    </Grid>
                </Modal.Body>
            </Modal>
        );
    };

    renderNeedToReturn = () => {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/OrderDetail/locales', 'OrderDetail');

        return (
            <div>
                <Text
                    is='h3'
                    fontWeight='bold'
                    data-at={Sephora.debug.dataAt('returns_exchanges_title')}
                    children={getText('needToReturn')}
                />
                <p
                    data-at={Sephora.debug.dataAt('returns_exchanges_message')}
                    children={getText('returnsText')}
                />
                <p>
                    <Link
                        padding={2}
                        margin={-2}
                        href='/beauty/returns-exchanges'
                        data-at={Sephora.debug.dataAt('returns_exchanges_link')}
                        color='blue'
                        underline={true}
                    >
                        {getText('seeReturnsPolicy')}
                    </Link>
                    <Text
                        marginX={2}
                        color='midGray'
                        children='|'
                    />
                    <Link
                        padding={2}
                        margin={-2}
                        href='/beauty/in-store-pick-up-faq'
                        data-at={Sephora.debug.dataAt('see_faqs_link')}
                        color='blue'
                        underline={true}
                    >
                        {getText('seefaq')}
                    </Link>
                </p>
            </div>
        );
    };

    renderReturnNoLongerAvailable = () => {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/OrderDetail/locales', 'OrderDetail');

        return (
            <div>
                <Text
                    is='h3'
                    fontWeight='bold'
                    data-at={Sephora.debug.dataAt('returns_exchanges_title')}
                    children={getText('needToReturnSomething')}
                />
                <Text>
                    {getText('returnsNoLongerAvailable')}
                    <Link
                        padding={2}
                        margin={-2}
                        href='/beauty/same-day-delivery-faq'
                        data-at={Sephora.debug.dataAt('see_faqs_link')}
                        color='blue'
                        underline={true}
                    >
                        {getText('returnFAQs')}
                    </Link>
                    {getText('returnsNoLongerAvailable2')}
                </Text>
            </div>
        );
    };

    renderSddReturnText = options => {
        const { isFullWidth } = options;
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/OrderDetail/locales', 'OrderDetail');

        return (
            <div>
                <Media lessThan='md'>
                    <Divider marginY={4} />
                </Media>
                <div css={isFullWidth ? styles.infoColumn : styles.infoRow}>
                    <h4
                        css={isFullWidth ? styles.infoRowLabelFullWidth : styles.infoRowLabel}
                        children={getText('needToReturnSomething')}
                    />
                    <Text>{getText('returnSddText')}</Text>
                </div>
                <Media lessThan='md'>
                    <Divider marginY={4} />
                </Media>
            </div>
        );
    };

    renderSectionHeader = function ({
        isSameDayOrder, header, getText, isAutoReplenOrder, sameDayUnlimitedShippingGroup, pickup
    }) {
        const title = getText(
            sameDayUnlimitedShippingGroup
                ? 'sameDayUnlimited'
                : isSameDayOrder
                    ? 'sameDayDelivery'
                    : isAutoReplenOrder && !Sephora.isMobile()
                        ? 'autoReplenishOrder'
                        : 'standardOrder'
        );
        const {
            isRopisOrder, isBopisOrder, orderId, orderDate, orderLabel
        } = header;
        const isPickup = isRopisOrder || isBopisOrder;

        return (
            <>
                <Box>
                    <Text
                        is='h3'
                        fontSize='md'
                        fontWeight={'bold'}
                        children={isPickup ? getText('pickUpOrder') : title}
                    />
                    {this.renderOrderNumber({
                        orderId,
                        getText
                    })}
                    <span
                        css={{
                            borderLeft: `1px solid ${colors.midGray}`,
                            marginLeft: '8px',
                            marginRight: '8px'
                        }}
                    />
                    {this.renderDate({
                        orderDate,
                        orderLabel
                    })}
                </Box>
                <Box marginBottom={4}>
                    {pickup &&
                        pickup.pickup &&
                        this.renderStoreName({
                            storeName: pickup.storeDetails.storeName
                        })}
                </Box>
            </>
        );
    };

    renderOrderNumber = function ({ orderId, getText }) {
        return (
            <Text
                is='h2'
                fontSize='sm'
                display={'inline'}
                data-at={Sephora.debug.dataAt('order_number')}
                children={`${getText('orderNumber')}${orderId}`}
            />
        );
    };

    renderStoreName = function ({ storeName }) {
        return (
            <Text
                is='h2'
                fontSize='sm'
                display={'inline'}
                data-at={Sephora.debug.dataAt('store_name')}
                children={ensureSephoraPrefix(storeName)}
            />
        );
    };

    renderDate = function ({ orderDate, orderLabel }) {
        return (
            <Text
                is='h3'
                fontSize='sm'
                marginBottom='1em'
                display={'inline'}
            >
                <span
                    data-at={Sephora.debug.dataAt('order_date')}
                    children={orderDate}
                />
                {orderLabel && (
                    <React.Fragment>
                        <br />
                        <span
                            data-at={Sephora.debug.dataAt('3rd_party_order')}
                            children={orderLabel}
                        />
                    </React.Fragment>
                )}
            </Text>
        );
    };

    renderManageSubscription = ({ getText }) => {
        return (
            <>
                <strong
                    children={getText('sameDayUnlimited')}
                    data-at={Sephora.debug.dataAt('sdd_delivery_instructions_label')}
                />
                <Link
                    href='/profile/MyAccount/SameDayUnlimited'
                    color='blue'
                    children={getText('manageSubscription')}
                />
            </>
        );
    };

    renderBillingInfo = function ({ paymentGroups, isGuestOrder, email, getText }) {
        return paymentGroups.paymentGroupsEntries.map((pg, index) => (
            <React.Fragment key={index.toString()}>
                {(pg.paymentGroup.address ||
                    pg.paymentGroupType === OrderUtils.CARD_TYPES.CreditCard ||
                    OrderUtils.isAlternativePaymentMethod(pg.paymentGroupType, pg.paymentGroup)) && (
                    <div>
                        {(isGuestOrder && pg.paymentGroupType !== OrderUtils.CARD_TYPES.Klarna) || (
                            <div>
                                {pg.paymentGroup.address && (
                                    <>
                                        <Address
                                            address={isGuestOrder ? this.getGuestBillingAddress(pg.paymentGroup.address) : pg.paymentGroup.address}
                                        />
                                        {isGuestOrder || (
                                            <Text
                                                is='div'
                                                numberOfLines={1}
                                                children={email}
                                            />
                                        )}
                                    </>
                                )}
                                {pg.paymentGroupType === OrderUtils.CARD_TYPES.CreditCard && pg.paymentGroup.cardNumber}
                                {OrderUtils.isAlternativePaymentMethod(pg.paymentGroupType, pg.paymentGroup) && (
                                    <Grid
                                        marginTop={(pg.paymentGroup.address || pg.paymentGroup.cardNumber) && 3}
                                        columns='auto 1fr'
                                        gap={2}
                                        alignItems='center'
                                    >
                                        <Image
                                            {...OrderUtils.alternativePaymentAltSrc(pg.paymentGroupType, pg.paymentGroup)}
                                            width={52}
                                            height={33}
                                        />
                                        <Text numberOfLines={1}>
                                            {getText(OrderUtils.alternativePaymentText(pg.paymentGroupType, pg.paymentGroup))}
                                            <br />
                                            {OrderUtils.alternativePaymentInfo(pg.paymentGroupType, pg.paymentGroup)}
                                        </Text>
                                    </Grid>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </React.Fragment>
        ));
    };

    renderPickupInstructions = ({ pickup }) => {
        const { storeDetails, pickupMethods } = pickup;
        const isInStorePickup = postCheckoutUtils.isInStorePickup(pickupMethods);
        const curbsideEnabled = storeUtils.isCurbsideEnabled(storeDetails);
        const conciergeCurbsideEnabled = storeUtils.isConciergeCurbsideEnabled(storeDetails);
        const showCurbsidePickupIndicator = curbsideEnabled && !conciergeCurbsideEnabled;
        const [curbsideMapImageTab] = storeUtils.getCurbsidePickupInstructions(storeDetails);
        const contentfulCurbsideInstruction = pickup?.content?.data?.curbsideInstruction;
        const isCurbsideDataAvailable = !!(contentfulCurbsideInstruction || curbsideMapImageTab);
        const showCurbsidePickupInstructions = !!(showCurbsidePickupIndicator && isCurbsideDataAvailable);
        const conciergePickupInstructions =
            curbsideEnabled && !isInStorePickup && conciergeCurbsideEnabled && storeUtils.getConciergePickupInstructions(storeDetails);

        if (showCurbsidePickupInstructions) {
            return (
                <>
                    <Divider />
                    {contentfulCurbsideInstruction && (
                        <div id={CURBSIDE_PICKUP_ID}>
                            <RichText
                                key='curbsideInstructionsText'
                                content={contentfulCurbsideInstruction}
                            />
                        </div>
                    )}
                    {curbsideMapImageTab && (
                        <BccComponentList
                            key='curbsideInstructionsImg'
                            isContained={false}
                            items={curbsideMapImageTab}
                            border={1}
                            borderColor='lightGray'
                            borderRadius={2}
                            overflow='hidden'
                        />
                    )}
                    <Divider display={[null, null, 'none']} />
                </>
            );
        }

        if (conciergePickupInstructions) {
            return (
                <>
                    <Divider />
                    <div id='conciergeInfo'>
                        <BccComponentList
                            key='conciergeInstructionsText'
                            isContained={false}
                            items={conciergePickupInstructions}
                            propsCallback={function (componentType) {
                                if (componentType === COMPONENT_NAMES.MARKDOWN) {
                                    return { css: { 'li + li': { marginTop: '.5em' } } };
                                } else {
                                    return null;
                                }
                            }}
                        />
                    </div>
                    <Divider display={[null, null, 'none']} />
                </>
            );
        }

        return null;
    };

    renderBOPIS = function ({
        orderId,
        isBopisOrder,
        isRopisOrder,
        isCanceledPickupOrder,
        pickup,
        pickupOrderStates,
        isReadyToPickUp,
        isProcessing,
        address,
        isPickedUp,
        getText,
        pickedupBopisOrder,
        header,
        paymentGroups,
        isGuestOrder,
        guestEmail,
        showCurbsidePickupIndicator
    }) {
        const { pickupMethods } = pickup;
        const isInStorePickup = postCheckoutUtils.isInStorePickup(pickupMethods);
        const isCurbsideConciergePickup = Boolean(
            pickup?.pickupMethods?.filter(method => method?.isSelected && method?.pickupMethodId === CURBSIDE_CONCIERGE)?.length
        );

        if (!isBopisOrder && !isRopisOrder) {
            return null;
        }

        return (
            <>
                {this.renderSectionHeader({
                    isSameDayOrder: false,
                    header,
                    getText,
                    pickup
                })}
                <Box marginBottom={4}>
                    <Grid
                        alignItems='flex-start'
                        columns={[null, null, 2]}
                        gap={5}
                    >
                        {isCanceledPickupOrder || (
                            <Grid gap={[5, null, 4]}>
                                <FulfillmentStatus
                                    isInStorePickup={isInStorePickup}
                                    isBopisOrder={isBopisOrder}
                                    storeDetails={pickup?.storeDetails}
                                    pickupOrderStates={pickupOrderStates}
                                    isCheckout={false}
                                    isReadyToPickUp={isReadyToPickUp}
                                    isProcessing={isProcessing}
                                    showCurbsidePickupIndicator={showCurbsidePickupIndicator}
                                    isCurbsideConciergePickup={isCurbsideConciergePickup}
                                    openCurbsideModal={this.openCurbsideModal}
                                    address={address}
                                    smsNotificationFlag={header.smsNotificationFlag}
                                />
                                {isPickedUp || (
                                    <>
                                        {isInStorePickup && (
                                            <Text
                                                is='p'
                                                data-at={Sephora.debug.dataAt('concierge_not_available_instructions')}
                                                children={getText('curbsideConciergeNotAvailable')}
                                            />
                                        )}
                                        {isCurbsideConciergePickup && isConciergePurchaseEnabled && (
                                            <Text
                                                is='p'
                                                data-at={Sephora.debug.dataAt('concierge_available_instructions')}
                                                children={getText('inStorePickupNotAvailable')}
                                            />
                                        )}
                                        <Grid
                                            columns={[null, null, 2]}
                                            maxWidth={[null, null, 416]}
                                            gap={[3, null, 4]}
                                        >
                                            <Media at='xs'>
                                                <Button
                                                    variant='primary'
                                                    width='100%'
                                                    disabled={isProcessing}
                                                    data-at={Sephora.debug.dataAt('show_barcode_button')}
                                                    onClick={this.openBarcodeModal}
                                                >
                                                    {getText('showBarcode')}
                                                </Button>
                                            </Media>
                                            <Media greaterThan='xs'>
                                                <Button
                                                    variant='primary'
                                                    width='100%'
                                                    disabled={isProcessing}
                                                    data-at={Sephora.debug.dataAt('show_barcode_button')}
                                                    onClick={this.openBarcodeModal}
                                                >
                                                    {getText('showBarcode')}
                                                </Button>
                                            </Media>
                                            <Button
                                                variant='secondary'
                                                data-at={Sephora.debug.dataAt('cancel_your_order_button')}
                                                onClick={async () => await OrderUtils.showOrderCancelationModal(orderId)}
                                            >
                                                {getText('cancelOrderButton')}
                                            </Button>
                                        </Grid>
                                    </>
                                )}
                                {pickedupBopisOrder && <Media greaterThan='sm'>{this.renderNeedToReturn()}</Media>}
                                {this.renderPickupInstructions({ pickup })}
                            </Grid>
                        )}
                        <PickupOrderStatus
                            orderId={orderId}
                            isPickedUp={isPickedUp}
                            isReadyToPickUp={isReadyToPickUp}
                            isCanceledPickupOrder={isCanceledPickupOrder}
                            isProcessing={isProcessing}
                            isAltPickPersonEnabledAfterOrdPlace={header.isAltPickPersonEnabledAfterOrdPlace}
                            isOmsAckedForAltPickupUpdate={header.isOmsAckedForAltPickupUpdate}
                            orderStatusDisplayName={header.statusDisplayName}
                            statusDescription={header.ropisStatusDescription}
                            paymentGroups={isRopisOrder ? [] : paymentGroups.paymentGroupsEntries}
                            isGuestOrder={isGuestOrder}
                            orderLocale={header.orderLocale}
                            email={isGuestOrder ? guestEmail : header.profile.login}
                            status={header.status}
                            pickupOrder={pickup}
                            noAdddress={true}
                            isBopisOrder={isBopisOrder}
                        />
                    </Grid>
                    {isPickedUp && isRopisOrder && (
                        <>
                            <Divider marginY={2} />
                            <Text
                                is='h3'
                                marginTop='1em'
                                fontSize='base'
                                fontWeight={'bold'}
                                data-at={Sephora.debug.dataAt('ropis_need_to_return')}
                                children={getText('needToReturn')}
                            />
                            <Text children={getText('returnsText')} />
                            <Text
                                is='p'
                                marginBottom={2}
                            >
                                <Link
                                    href='/beauty/returns-exchanges'
                                    color='blue'
                                    underline={true}
                                    padding={1}
                                    margin={-1}
                                >
                                    {getText('seeReturnsPolicy')}
                                </Link>
                                <Text
                                    marginX={2}
                                    color='midGray'
                                    children='|'
                                />
                                <Link
                                    href='/beauty/in-store-pick-up-faq'
                                    color='blue'
                                    underline={true}
                                    data-at={Sephora.debug.dataAt('see_faqs_link')}
                                    padding={1}
                                    margin={-1}
                                >
                                    {getText('seefaq')}
                                </Link>
                            </Text>
                            <Divider marginY={2} />
                            <Text
                                is='h3'
                                fontSize='md'
                                marginTop='1em'
                                data-at={Sephora.debug.dataAt('ropis_original_reservation')}
                                children={getText('originalReservationTitle')}
                                fontWeight={'bold'}
                            />
                            <Grid
                                columns='auto 1fr'
                                gap={2}
                                marginTop='.5em'
                            >
                                <Icon
                                    data-at={Sephora.debug.dataAt('error_icon')}
                                    name='alert'
                                    size={20}
                                    color='red'
                                />
                                <Text data-at={Sephora.debug.dataAt('ropis_original_reservation_message')}>
                                    {getText('originalReservationText')}
                                    <Link
                                        href='/purchase-history'
                                        color='blue'
                                        display='inline'
                                    >
                                        {getText('purchaseHistory')}
                                    </Link>
                                    {getText('originalReservationText2')}
                                </Text>
                            </Grid>
                        </>
                    )}
                </Box>
            </>
        );
    };

    renderSelfCancelationSDULink = function ({ getText, twoCols, sameDayOrderStatus, isSelfCancellationLinkEnabled }) {
        if (!isSelfCancellationLinkEnabled || OrderUtils.isDelivered(sameDayOrderStatus)) {
            return null;
        }

        return (
            <Grid
                alignItems='flex-start'
                columns={twoCols ? [1] : [null, null, 2]}
                gap={5}
                marginTop={twoCols ? 0 : 2}
            >
                <Box>
                    <Text is='p'>
                        <span>
                            {getText('changedYourMind')}
                            {getText('call188')}
                        </span>
                        <span>
                            <Link
                                href='/beauty/customer-service'
                                display={'inline'}
                                underline={true}
                                color={'blue'}
                                children={getText('chatWith')}
                            />
                        </span>
                        <span>{getText('toCancel')}</span>
                    </Text>
                </Box>
            </Grid>
        );
    };

    handleReturnLinkClick = function () {
        const shippingMethod = getOrderShippingMethod();
        returnLinkClick({ shippingMethod });
    };

    renderReturnDeliveryLink = function ({
        shipGroups,
        orderId,
        isdeliveryLinkAvailable,
        getText,
        isSddReturnLinkEnabled,
        isFullWidth = false,
        showStartAndTrackAReturn
    }) {
        const showDeliveryLink = Sephora?.configurationSettings?.enableSelfReship && isdeliveryLinkAvailable;

        return (
            <>
                {isSddReturnLinkEnabled && (
                    <>
                        <Media lessThan='md'>
                            <Divider marginY={4} />
                        </Media>
                        <div css={isFullWidth ? styles.infoColumn : styles.infoRow}>
                            <h4
                                css={isFullWidth ? styles.infoRowLabelFullWidth : styles.infoRowLabel}
                                children={getText('needToReturnSomething')}
                            />
                            <ReturnLink
                                orderId={orderId}
                                shipGroups={shipGroups}
                                onClickHandler={this.handleReturnLinkClick}
                                showStartAndTrackAReturn={showStartAndTrackAReturn}
                            />
                        </div>
                    </>
                )}
                {showDeliveryLink ? (
                    <>
                        <Media lessThan='md'>
                            <Divider marginY={4} />
                        </Media>
                        <div css={isFullWidth ? styles.infoColumn : styles.infoRow}>
                            <h4
                                css={isFullWidth ? styles.infoRowLabelFullWidth : styles.infoRowLabel}
                                children={getText('deliveryIssue')}
                            />
                            <Link
                                onClick={() => this.openDeliveryIssueModal({ orderId })}
                                href={null}
                                color='blue'
                                target='_blank'
                                children={getText('reportIssue')}
                            />
                        </div>
                    </>
                ) : null}
            </>
        );
    };

    renderSelfCancelationLink = function ({ isSelfCancellationLinkEnabled, orderId, getText }) {
        if (!isSelfCancellationLinkEnabled) {
            return null;
        }

        return (
            <Text
                is='p'
                marginTop={[5, null, 4]}
            >
                {getText('changedYourMind')}{' '}
                <Link
                    id='cancelOrderLink'
                    onClick={async () => await OrderUtils.showOrderCancelationModal(orderId)}
                    color='blue'
                    underline={true}
                    padding={2}
                    margin={-2}
                    children={getText('cancelYourOrder')}
                />
            </Text>
        );
    };

    determineSddReturnTextVisibility = options => {
        const { isSddReturnsEnabled, isSddReturnLinkEnabled, sameDayOrderStatus } = options;

        return isSddReturnsEnabled && !isSddReturnLinkEnabled && sameDayOrderStatus === PROCESSING;
    };

    determineSddReturnLinkVisibility = options => {
        const { isSddReturnsEnabled, isSameDayOrder, sameDayOrderStatus } = options;
        const isOnItsWayOrDelivered =
            sameDayOrderStatus === HEADER_LEVEL_SDD_ORDER_STATUS.ON_ITS_WAY || sameDayOrderStatus === HEADER_LEVEL_SDD_ORDER_STATUS.DELIVERED;

        return isSddReturnsEnabled && isSameDayOrder && isOnItsWayOrDelivered;
    };

    /* eslint-disable-next-line complexity */
    renderSDD = function ({
        isSameDayOnly,
        sameDayShippingGroup,
        canceledItems,
        isStandardMulti,
        isCanceledPickupOrder,
        header,
        paymentGroups,
        guestEmail,
        getText,
        sameDayUnlimitedShippingGroup,
        isSDUOnly,
        mixedItemsWithSDUOnlyInSDD,
        isSDUSubscriptionInOrder
    }) {
        if (!sameDayShippingGroup && !isSDUOnly) {
            return null;
        }

        const {
            shippingGroup: {
                sameDayOrderStates = [], deliveryInstructions, address, deliveryWindow, trackingUrl
            }
        } = sameDayShippingGroup;

        const {
            isGuestOrder,
            orderId,
            orderLocale,
            splitOrder,
            isSelfCancellationLinkEnabled,
            isSddReturnsEnabled,
            isSddReturnLinkEnabled,
            profile,
            buttonState,
            status,
            isSameDayOrder,
            sameDayOrderStatus,
            sameDayOrderStatusDisplayName,
            isdeliveryLinkAvailable,
            smsNotificationFlag,
            showStartAndTrackAReturn
        } = header;

        const isOrderCanceled = this.isOrderCanceled({
            isSameDayOrder,
            sameDayOrderStatus
        });
        const isShippedSDDOrder = sameDayOrderStatus === OrderUtils.HEADER_LEVEL_SDD_ORDER_STATUS.ON_ITS_WAY;
        const ifSddOrderIsDelivered = sameDayOrderStatus === OrderUtils.ORDER_TRACKING_BUTTON_STATES.DELIVERED;
        const shouldShowSddReturnLink = this.determineSddReturnLinkVisibility({
            isSddReturnsEnabled,
            isSameDayOrder,
            sameDayOrderStatus
        });
        const shouldShowSddReturnText = this.determineSddReturnTextVisibility({
            isSddReturnsEnabled,
            isSddReturnLinkEnabled,
            sameDayOrderStatus
        });
        const displayBillingInfo =
            paymentGroups.paymentGroupsEntries.length > 0 &&
            paymentGroups.paymentGroupsEntries.find(group => group.paymentGroupType !== OrderUtils.PAYMENT_GROUP_TYPE.GIFT_CARD);

        return (
            <>
                {this.renderSectionHeader({
                    isSameDayOrder: true,
                    isSDUOnly,
                    sameDayUnlimitedShippingGroup,
                    header,
                    getText
                })}
                <Box marginBottom={4}>
                    <Grid
                        alignItems='flex-start'
                        columns={[null, null, isOrderCanceled ? 1 : 2]}
                        gap={5}
                    >
                        {isCanceledPickupOrder || isSDUOnly || mixedItemsWithSDUOnlyInSDD || (
                            <Grid gap={[5, null, 4]}>
                                {!isOrderCanceled && sameDayOrderStates.length > 0 ? (
                                    <FulfillmentStatus
                                        hrefForFaq='/beauty/same-day-delivery-faq'
                                        canceledItems={canceledItems}
                                        pickupOrderStates={sameDayOrderStates.map(s => {
                                            if (s.status === ACTIVE) {
                                                return {
                                                    ...s,
                                                    stateMessages: [{ statusMessageComponent: StatusMessage }]
                                                };
                                            }

                                            return s;
                                        })}
                                        isSameDayOrder={isSameDayOrder}
                                        isSDDOrderDelivered={ifSddOrderIsDelivered}
                                        trackingUrl={trackingUrl}
                                        showModal={this.showModal}
                                        smsNotificationFlag={smsNotificationFlag}
                                    />
                                ) : null}
                                {sameDayUnlimitedShippingGroup &&
                                    this.renderSelfCancelationSDULink({
                                        getText,
                                        twoCols: true,
                                        sameDayOrderStatus,
                                        isSelfCancellationLinkEnabled
                                    })}
                                {isSameDayOnly &&
                                    !sameDayUnlimitedShippingGroup &&
                                    this.renderSelfCancelationLink({
                                        isSelfCancellationLinkEnabled,
                                        orderId,
                                        getText
                                    })}
                                {ifSddOrderIsDelivered && !isSddReturnsEnabled && <Media greaterThan='sm'>{this.renderNeedToReturn()}</Media>}
                                {ifSddOrderIsDelivered && isSddReturnsEnabled && !isSddReturnLinkEnabled && (
                                    <Media greaterThan='sm'>{this.renderReturnNoLongerAvailable()}</Media>
                                )}
                                {shouldShowSddReturnText && <Media greaterThan='sm'>{this.renderSddReturnText({ isFullWidth: true })}</Media>}
                                {shouldShowSddReturnLink && sameDayShippingGroup && orderId && (
                                    <Media greaterThan='sm'>
                                        {this.renderReturnDeliveryLink({
                                            shipGroups: [sameDayShippingGroup],
                                            orderId,
                                            isdeliveryLinkAvailable,
                                            getText,
                                            isSddReturnLinkEnabled,
                                            isFullWidth: true,
                                            showStartAndTrackAReturn
                                        })}
                                    </Media>
                                )}
                            </Grid>
                        )}
                        {mixedItemsWithSDUOnlyInSDD && (
                            <Grid
                                rowGap={[3, null, 4]}
                                columnGap={4}
                                gridTemplateColumns='[label] 8em [value] 1fr'
                                css={{
                                    '& > :nth-child(odd)': { gridColumn: 'label' },
                                    '& > :nth-child(even)': { gridColumn: 'value' }
                                }}
                            >
                                <strong
                                    children={getText('statusLabel')}
                                    data-at={Sephora.debug.dataAt('sdd_order_status_label')}
                                />
                                <OrderStatusDisplayName
                                    isOrderCanceled={isOrderCanceled}
                                    orderStatusDisplayName={isSDUOnly || mixedItemsWithSDUOnlyInSDD ? status : sameDayOrderStatusDisplayName}
                                    orderStatus={isSDUOnly || mixedItemsWithSDUOnlyInSDD ? status : sameDayOrderStatus}
                                    showModal={this.showModal}
                                />
                            </Grid>
                        )}
                        <Grid
                            rowGap={[3, null, 4]}
                            columnGap={4}
                            gridTemplateColumns='[label] 8em [value] 1fr'
                            css={{
                                '& > :nth-child(odd)': { gridColumn: 'label' },
                                '& > :nth-child(even)': { gridColumn: 'value' }
                            }}
                        >
                            {mixedItemsWithSDUOnlyInSDD || (
                                <>
                                    <strong
                                        children={getText('statusLabel')}
                                        data-at={Sephora.debug.dataAt('sdd_order_status_label')}
                                    />
                                    <OrderStatusDisplayName
                                        isOrderCanceled={isOrderCanceled}
                                        orderStatusDisplayName={isSDUOnly || mixedItemsWithSDUOnlyInSDD ? status : sameDayOrderStatusDisplayName}
                                        orderStatus={isSDUOnly || mixedItemsWithSDUOnlyInSDD ? status : sameDayOrderStatus}
                                        showModal={this.showModal}
                                    />
                                </>
                            )}
                            {isSDUOnly || mixedItemsWithSDUOnlyInSDD || (
                                <>
                                    <strong
                                        children={getText('deliveryWindow')}
                                        data-at={Sephora.debug.dataAt('sdd_delivery_window_label')}
                                    />
                                    <Text>{deliveryWindow}</Text>
                                    <strong
                                        children={getText('deliverTo')}
                                        data-at={Sephora.debug.dataAt('sdd_deliver_to_label')}
                                    />
                                    <Address address={address} />
                                </>
                            )}
                            {deliveryInstructions && (
                                <>
                                    <strong
                                        children={getText('deliveryInstructions')}
                                        data-at={Sephora.debug.dataAt('sdd_delivery_instructions_label')}
                                    />
                                    <Text>{deliveryInstructions}</Text>
                                </>
                            )}
                            {displayBillingInfo && (
                                <>
                                    <strong
                                        children={getText('billingInfo')}
                                        data-at={Sephora.debug.dataAt('sdd_billing_info_label')}
                                    />
                                    {this.renderBillingInfo({
                                        paymentGroups,
                                        isGuestOrder,
                                        email: isGuestOrder ? guestEmail : header.profile.login,
                                        getText
                                    })}
                                </>
                            )}
                            {sameDayUnlimitedShippingGroup && this.renderManageSubscription({ getText })}
                        </Grid>
                        {ifSddOrderIsDelivered && !isCanceledPickupOrder && !isSddReturnsEnabled && (
                            <Media lessThan='md'>{this.renderNeedToReturn()}</Media>
                        )}
                        {ifSddOrderIsDelivered && !isCanceledPickupOrder && isSddReturnsEnabled && (
                            <Media lessThan='md'>{this.renderReturnNoLongerAvailable()}</Media>
                        )}
                        {shouldShowSddReturnText && <Media lessThan='sm'>{this.renderSddReturnText({ isFullWidth: false })}</Media>}
                        {shouldShowSddReturnLink && sameDayShippingGroup && orderId && (
                            <Media lessThan='md'>
                                {this.renderReturnDeliveryLink({
                                    shipGroups: [sameDayShippingGroup],
                                    orderId,
                                    isdeliveryLinkAvailable,
                                    getText,
                                    isSddReturnLinkEnabled,
                                    showStartAndTrackAReturn
                                })}
                            </Media>
                        )}
                    </Grid>
                </Box>
                {/** Same-Day Delivery renders its own items list */}
                <OrderShippingGroups
                    sameDayType={true}
                    isSameDayOnly={isSameDayOnly}
                    isStandardMulti={isStandardMulti}
                    orderId={orderId}
                    orderLocale={orderLocale}
                    status={status}
                    shippingStatus={sameDayOrderStatus}
                    shippingStatusDisplayName={sameDayOrderStatusDisplayName}
                    buttonState={buttonState}
                    splitOrder={splitOrder}
                    isReturnable={false}
                    isGuestOrder={isGuestOrder}
                    isPickupOrder={false}
                    isCanceledPickupOrder={isCanceledPickupOrder}
                    shipGroups={[sameDayShippingGroup]}
                    pickupOrderData={this.state}
                    email={isGuestOrder ? guestEmail : profile.login}
                    paymentGroups={paymentGroups.paymentGroupsEntries}
                    isBopisOrder={false}
                    isShippedSDDOrder={isShippedSDDOrder}
                    isDeliveredSDDOrder={ifSddOrderIsDelivered}
                    isSDUSubscriptionInOrder={isSDUSubscriptionInOrder}
                    isdeliveryLinkAvailable={isdeliveryLinkAvailable}
                    showStartAndTrackAReturn={showStartAndTrackAReturn}
                />
            </>
        );
    };

    renderPickedUpBopis = function ({ pickedupBopisOrder, getText }) {
        if (!pickedupBopisOrder) {
            return null;
        }

        return (
            <>
                <Media lessThan='md'>
                    <Divider marginY={2} />
                    {this.renderNeedToReturn()}
                </Media>
                <Box
                    marginTop={[4, null, 0]}
                    paddingY={2}
                    paddingX={3}
                    color='black'
                    borderRadius={2}
                    lineHeight='tight'
                    backgroundColor='nearWhite'
                >
                    <span children={getText('buyItAgainText1')} />
                    <Link
                        href='/purchase-history'
                        color='blue'
                        underline={true}
                    >
                        {getText('buyItAgainLinkText')}
                    </Link>
                    <span children={getText('buyItAgainText2')} />
                </Box>
            </>
        );
    };

    partitionShippingGroups = shippingGroups => {
        if (!shippingGroups) {
            return {};
        }

        const { shippingGroupsEntries } = shippingGroups;
        const { SHIPPING_GROUPS } = OrderUtils;

        // should only be 1 Same-Day Shipping Group
        const sameDayPedicate = entry => {
            return entry.shippingGroupType === SHIPPING_GROUPS.SAME_DAY || entry.shippingGroupType === SHIPPING_GROUPS.SDU_ELECTRONIC;
        };
        // should only be 1 Same-Day Unlimited Group
        const sameDayUnlimitedPedicate = entry => {
            return entry.shippingGroupType === SHIPPING_GROUPS.SDU_ELECTRONIC;
        };
        const sameDayShippingGroup = shippingGroupsEntries?.find(sameDayPedicate);
        const sameDayUnlimitedShippingGroup = shippingGroupsEntries?.find(sameDayUnlimitedPedicate);
        const standardShippingGroupEntries = reject(shippingGroupsEntries || [], sameDayPedicate);
        const isStandardMulti = standardShippingGroupEntries.length > 1;
        const isStandardEmpty = standardShippingGroupEntries.length === 0;
        const isStandardOnly = !sameDayShippingGroup && !isStandardEmpty;
        const isSameDayOnly = sameDayShippingGroup && isStandardEmpty;
        const isSDUOnly = sameDayUnlimitedShippingGroup && shippingGroups?.shippingGroupsEntries.length === 1;
        const areAllShippingGroupsSDD = shippingGroups?.shippingGroupsEntries?.every(group => {
            return group.shippingGroupType === SHIPPING_GROUPS.SAME_DAY || group.shippingGroupType === SHIPPING_GROUPS.SDU_ELECTRONIC;
        });

        const isSDUOnlyInSDD =
            !!sameDayShippingGroup &&
            sameDayShippingGroup.shippingGroup.items.length === 1 &&
            sameDayShippingGroup.shippingGroup.items[0].sku.type === 'SDU';
        const mixedItemsWithSDUOnlyInSDD = sameDayUnlimitedShippingGroup && !areAllShippingGroupsSDD && isSDUOnlyInSDD;
        const isSameDayAndStandard = sameDayShippingGroup && !isStandardEmpty;
        const flagToDisplayAutoReplenish = isStandardOnly || isSameDayAndStandard;
        const isSDUSubscriptionInOrder = this.state.header.sduOrderType === 1;

        if (sameDayShippingGroup) {
            sameDayShippingGroup.shippingGroup.items =
                sameDayShippingGroup && sameDayUnlimitedShippingGroup && !isSDUOnly
                    ? [
                        ...sameDayUnlimitedShippingGroup.shippingGroup.items,
                        ...sameDayShippingGroup.shippingGroup.items.filter(item => item.sku?.type !== 'SDU')
                    ]
                    : sameDayShippingGroup.shippingGroup.items;
        }

        return {
            sameDayShippingGroup,
            standardShippingGroupEntries,
            isStandardMulti,
            isStandardOnly,
            isSameDayOnly,
            isSameDayAndStandard,
            flagToDisplayAutoReplenish,
            sameDayUnlimitedShippingGroup,
            isSDUOnly,
            mixedItemsWithSDUOnlyInSDD,
            isSDUSubscriptionInOrder
        };
    };

    renderCombinedShippingOrderTotal = function ({
        isStandardOnly,
        isStandardMulti,
        priceInfo,
        orderLocale,
        isAutoReplenOrder,
        isPickupOrder,
        isSDUOnly,
        redeemedPoints,
        isSDDOrderProcessing,
        splitEDDExperienceDisplayed
    }) {
        if (isStandardOnly || isStandardMulti || isPickupOrder) {
            return null;
        }

        return (
            <>
                {!splitEDDExperienceDisplayed && (
                    <Divider
                        color='black'
                        marginY={[4, null, 5]}
                        height={2}
                    />
                )}
                {/* Order totals for STH+SDD, SDD */}
                <OrderTotal
                    isOrderDetail={true}
                    dataAt='description'
                    priceInfo={priceInfo}
                    orderLocale={orderLocale}
                    isAutoReplenOrder={isAutoReplenOrder}
                    isSDUOnly={isSDUOnly}
                    redeemedPoints={redeemedPoints}
                    isSDDOrderProcessing={isSDDOrderProcessing}
                    splitEDDExperienceDisplayed={splitEDDExperienceDisplayed}
                />
            </>
        );
    };

    /* eslint-disable-next-line complexity */
    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/OrderDetail/locales', 'OrderDetail');
        const {
            hasInitialized,
            guestEmail,
            shippingGroups,
            items,
            header,
            pickup = {},
            isPickedUp,
            isCanceledPickupOrder,
            isProcessing,
            isReadyToPickUp,
            paymentGroups,
            priceInfo,
            biPoints
        } = this.state;
        const { isSplitEDDEnabled, splitEDDExperienceDisplayed } = this.props;
        const { storeDetails } = pickup;
        const itemsByBasket = items?.itemsByBasket;

        const showCurbsidePickupIndicator = storeUtils.isCurbsideEnabled(storeDetails);

        const {
            isGuestOrder,
            orderId,
            isReturnLinkEnabled,
            isSelfCancellationLinkEnabled,
            isSelfServiceNCR,
            isRopisOrder,
            isBopisOrder,
            orderLocale,
            fulfillmentPartner,
            isdeliveryLinkAvailable,
            sameDayOrderStatus,
            showStartAndTrackAReturn
        } = header || {};

        const isSDDOrderProcessing = sameDayOrderStatus === HEADER_LEVEL_SDD_ORDER_STATUS.PROCESSING;
        const shouldDisplayReturnLink =
            isReturnLinkEnabled &&
            (header.standardOrderStatus === HEADER_LEVEL_STANDARD_ORDER_STATUS.SHIPPED ||
                header.standardOrderStatus === HEADER_LEVEL_STANDARD_ORDER_STATUS.DELIVERED);
        let pickupOrderStates;
        let address;

        if (pickup) {
            if (pickup.pickupOrderStates) {
                pickupOrderStates = [...pickup?.pickupOrderStates];
            }

            address = pickup.storeDetails && pickup.storeDetails.address;
        }

        const pickedupBopisOrder = isPickedUp && isBopisOrder;
        const isPickupOrder = isBopisOrder || isRopisOrder;
        const redeemedPoints = biPoints?.redeemedPoints || items?.redeemedBiPoints;

        const {
            standardShippingGroupEntries,
            sameDayShippingGroup,
            isStandardMulti,
            isStandardOnly,
            isSameDayAndStandard,
            isSameDayOnly,
            flagToDisplayAutoReplenish,
            sameDayUnlimitedShippingGroup,
            isSDUOnly,
            mixedItemsWithSDUOnlyInSDD,
            isSDUSubscriptionInOrder
        } = this.partitionShippingGroups(shippingGroups);

        const isAutoReplenOrder = flagToDisplayAutoReplenish && OrderUtils.hasAutoReplenishItems(this.state);
        const isKohlsPickup = fulfillmentPartner?.name === 'KOHLS';
        const barcodeId = isKohlsPickup ? fulfillmentPartner.orderId : orderId;

        return (
            <Container
                is='main'
                hasLegacyWidth={true}
            >
                <Flex
                    justifyContent='space-between'
                    alignItems='baseline'
                    marginY={5}
                    lineHeight='tight'
                >
                    <Text
                        is='h1'
                        fontSize={['xl', null, '2xl']}
                        fontFamily='serif'
                        children={getText('orderDetails')}
                    />
                    {hasInitialized && !isGuestOrder && (
                        <Link
                            onClick={e => this.handleViewOrderHistoryClick(e)}
                            color='blue'
                            padding={3}
                            margin={-3}
                            children={getText('orderHistory')}
                        />
                    )}
                </Flex>
                {hasInitialized && (
                    <>
                        <Divider
                            color='black'
                            height={2}
                            marginBottom={5}
                        />
                        {this.renderBarcodeModal(barcodeId)}
                        {this.renderBOPIS({
                            orderId,
                            isBopisOrder,
                            isRopisOrder,
                            isCanceledPickupOrder,
                            pickup,
                            pickupOrderStates,
                            isReadyToPickUp,
                            isProcessing,
                            address,
                            isPickedUp,
                            getText,
                            pickedupBopisOrder,
                            header,
                            paymentGroups,
                            isGuestOrder,
                            guestEmail,
                            showCurbsidePickupIndicator
                        })}
                        {this.renderPickedUpBopis({
                            pickedupBopisOrder,
                            getText
                        })}
                        {isSameDayAndStandard && (
                            <>
                                <StandardAndSddOrderSummary
                                    sddStatus={sameDayUnlimitedShippingGroup ? 'Placed' : header.sameDayOrderStatus}
                                    sddStatusDisplayName={sameDayUnlimitedShippingGroup ? 'Placed' : header.sameDayOrderStatusDisplayName}
                                    standardStatus={header.standardOrderStatus}
                                    standardStatusDisplayName={header.standardOrderStatusDisplayName}
                                    itemsByBasket={itemsByBasket}
                                    sameDayUnlimitedShippingGroup={sameDayUnlimitedShippingGroup}
                                />
                                {sameDayUnlimitedShippingGroup &&
                                    this.renderSelfCancelationSDULink({
                                        getText,
                                        sameDayOrderStatus,
                                        isSelfCancellationLinkEnabled
                                    })}
                                {!sameDayUnlimitedShippingGroup &&
                                    this.renderSelfCancelationLink({
                                        isSelfCancellationLinkEnabled,
                                        orderId,
                                        getText
                                    })}
                                <Divider
                                    color='black'
                                    height={2}
                                    marginY={[4, null, 5]}
                                    id={SDD_ORDER_DETAILS}
                                />
                            </>
                        )}
                        {this.renderSDD({
                            isSameDayOnly,
                            sameDayShippingGroup,
                            sameDayUnlimitedShippingGroup,
                            canceledItems: this.getCanceledSDDItems(items?.itemsByBasket),
                            isStandardOnly,
                            isStandardMulti,
                            isCanceledPickupOrder,
                            pickup,
                            pickupOrderStates,
                            isProcessing,
                            address,
                            header,
                            paymentGroups,
                            guestEmail,
                            getText,
                            isSDUOnly,
                            mixedItemsWithSDUOnlyInSDD,
                            isSDUSubscriptionInOrder
                        })}
                        {isSameDayAndStandard && (
                            <Divider
                                color='black'
                                height={2}
                                marginY={[4, null, 5]}
                                id={STANDARD_SHIPPING_ORDER_DETAILS}
                            />
                        )}
                        {/* Mixed order with STH, GC or EShipping */}
                        <OrderShippingGroups
                            isSelfServiceNCR={isSelfServiceNCR}
                            orderPriceInfo={priceInfo}
                            isStandardOnly={isStandardOnly}
                            isStandardMulti={isStandardMulti}
                            isSameDayAndStandard={isSameDayAndStandard}
                            isSameDayOnly={isSameDayOnly}
                            sameDayType={false}
                            sameDayPriceInfo={sameDayShippingGroup?.priceInfo}
                            renderStandardSectionHeader={
                                (isStandardOnly || isSameDayAndStandard) &&
                                (() =>
                                    this.renderSectionHeader({
                                        isSameDayOrder: false,
                                        header,
                                        getText,
                                        isAutoReplenOrder
                                    }))
                            }
                            renderSelfCancelationLink={
                                isStandardOnly &&
                                (() =>
                                    this.renderSelfCancelationLink({
                                        isSelfCancellationLinkEnabled,
                                        orderId,
                                        getText
                                    }))
                            }
                            orderId={orderId}
                            orderLocale={header.orderLocale}
                            status={header.status}
                            statusDisplayName={header.statusDisplayName}
                            shippingStatus={header.standardOrderStatus}
                            shippingStatusDisplayName={header.standardOrderStatusDisplayName}
                            buttonState={header.buttonState}
                            splitOrder={header.splitOrder}
                            isReturnable={shouldDisplayReturnLink}
                            isGuestOrder={isGuestOrder}
                            isSelfCancellationLinkEnabled={isSelfCancellationLinkEnabled}
                            isPickupOrder={isPickupOrder}
                            isCanceledPickupOrder={isCanceledPickupOrder}
                            shipGroups={isRopisOrder ? [] : standardShippingGroupEntries}
                            pickupOrderData={this.state}
                            email={isGuestOrder ? guestEmail : header.profile.login}
                            paymentGroups={isRopisOrder ? [] : paymentGroups.paymentGroupsEntries}
                            isBopisOrder={isBopisOrder}
                            isAutoReplenOrder={isAutoReplenOrder}
                            autoReplenishItems={this.getAutoReplenishItems(itemsByBasket)}
                            isdeliveryLinkAvailable={isdeliveryLinkAvailable}
                            isSplitEDDEnabled={isSplitEDDEnabled}
                            showStartAndTrackAReturn={showStartAndTrackAReturn}
                        />
                        {this.renderCombinedShippingOrderTotal({
                            isStandardOnly,
                            isStandardMulti,
                            priceInfo,
                            orderLocale,
                            isPickupOrder,
                            isSDUOnly,
                            redeemedPoints,
                            isSDDOrderProcessing,
                            splitEDDExperienceDisplayed
                        })}
                    </>
                )}
            </Container>
        );
    }
}

const headingStyle = { fontWeight: 'var(--font-weight-bold)' };
const styles = {
    label: [headingStyle, { marginBottom: '.125em' }],
    infoRow: {
        display: 'flex',
        alignItems: 'baseline',
        marginBottom: space[2]
    },
    infoColumn: {
        display: 'flex',
        marginBottom: space[2],
        flexDirection: 'column'
    },
    infoRowLabel: [
        headingStyle,
        {
            flexShrink: 0,
            width: itemWidths.IMAGE + space[5],
            paddingRight: space[3],
            wordBreak: 'break-word'
        }
    ],
    infoRowLabelFullWidth: [
        headingStyle,
        {
            flexShrink: 0,
            paddingRight: space[3],
            wordBreak: 'break-word'
        }
    ]
};

export default wrapComponent(OrderDetail, 'OrderDetail', true);
