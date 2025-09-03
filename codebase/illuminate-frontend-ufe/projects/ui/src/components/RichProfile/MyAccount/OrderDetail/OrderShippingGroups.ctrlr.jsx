import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { space, breakpoints } from 'style/config';
import isFunction from 'utils/functions/isFunction';
import {
    Box, Divider, Grid, Text, Link, Image, Button, Flex
} from 'components/ui';
import Address from 'components/Addresses/Address';
import OrderUtils from 'utils/Order';
import localeUtils from 'utils/LanguageLocale';
import dateUtils from 'utils/Date';
import checkoutUtils from 'utils/Checkout';
import orderActions from 'actions/OrderActions';
import OrderItemList from 'components/OrderConfirmation/OrderItemList/OrderItemList';
import OrderTotal from 'components/OrderConfirmation/OrderTotal';
import TrackOrderButton from 'components/RichProfile/MyAccount/TrackOrderButton/TrackOrderButton';
import ReturnLink from 'components/RichProfile/MyAccount/ReturnLink/ReturnLink';
import { itemWidths } from 'components/Product/ProductListItem/constants';
import OrderStatusDisplayName from 'components/RichProfile/MyAccount/OrderDetail/OrderStatusDisplayName/OrderStatusDisplayName';
import PickupPerson from 'components/SharedComponents/AccessPoint/PickupPerson/PickupPerson';
import { leftColWidth } from 'components/SharedComponents/AccessPoint/PickupPerson/constants';
import urlUtils from 'utils/Url';
import creditCardUtils from 'utils/CreditCard';
import userUtils from 'utils/User';
import store from 'store/Store';
import replacementOrderBindings from 'analytics/bindingMethods/pages/replacementOrder/replacementOrderBindings';
import orderDetailsBindings from 'analytics/bindingMethods/pages/orderDetails/orderDetailsBindings';
import anaConsts from 'analytics/constants';
import Empty from 'constants/empty';

const { isHalAddress, getOrderShippingMethod } = OrderUtils;
const { returnLinkClick } = orderDetailsBindings;
const IN_PROGRESS = 'In Progress';
const PLACED = 'Placed';
const { SHIPPING_GROUPS } = OrderUtils;

const {
    SMS: { ORDER_DETAILS_PAGENAME }
} = anaConsts;
const { modalLoadTracking } = replacementOrderBindings;

class OrderShippingGroups extends BaseClass {
    state = {
        optInAvailable: false
    };

    /**
     * removes props from shipping address object that are not allowed for display
     * @param {*} address object
     */
    getGuestShippingAddress = (address, isCanada) => {
        if (isCanada) {
            address.postalCode = address.postalCode.substr(0, 3);
        }

        return this.filterObject(address, ['firstName', 'lastName', 'city', 'state', 'postalCode']);
    };

    /**
     * removes props from billing address object that are not allowed for display
     * @param {*} address object
     */
    getGuestBillingAddress = address => {
        return this.filterObject(address, ['firstName', 'lastName']);
    };

    /**
     * removes props from object that are not in props array
     * @param {*} obj object
     * @param {*} props array of allowed props
     */
    filterObject = (obj, props = []) => {
        const result = {};

        props.forEach(prop => {
            if (obj[prop]) {
                result[prop] = obj[prop];
            }
        });

        return result;
    };

    openDeliveryIssueModal = ({ orderId }) => {
        store.dispatch(orderActions.loadDeliveryIssues());
        //Analytics
        modalLoadTracking({
            pageDetail: anaConsts.PAGE_DETAIL.REPORT_ISSUE_MODAL,
            eventStrings: [anaConsts.Event.REPORT_ISSUE_MODAL],
            orderId
        });
    };

    renderTrackingNumber = ({ trackingNumber, trackingUrl, getText }) => {
        if (!trackingNumber && !trackingUrl) {
            return null;
        }

        return (
            <div css={styles.infoRow}>
                <h4
                    css={styles.infoRowLabel}
                    children={getText('tracking')}
                />
                <Link
                    href={trackingUrl}
                    color='blue'
                    target='_blank'
                    children={getText('seeTrackingDetails')}
                />
            </div>
        );
    };

    renderTrackingButton = ({ buttonState, trackingUrl }) => {
        if (!buttonState && !trackingUrl) {
            return null;
        }

        return (
            <Box
                marginTop={4}
                maxWidth={[null, null, 350]}
            >
                <TrackOrderButton
                    status={buttonState}
                    url={trackingUrl}
                />
            </Box>
        );
    };

    /* eslint-disable-next-line complexity */
    getShipInfo = ({
        renderSelfCancelationLink, getText, group, isGuestOrder, isCanada, isSingle, index
    }) => {
        const isUS = localeUtils.isUS();
        const isGiftCard = group.shippingGroupType === orderActions.SHIPPING_GROUPS.GIFT;
        const { trackingNumber, trackingUrl } = group.shippingGroup;

        const hasHalAddress = isHalAddress(group.shippingGroup?.address);

        const address =
            isGuestOrder && !hasHalAddress ? this.getGuestShippingAddress(group.shippingGroup.address, isCanada) : group.shippingGroup.address;

        /* eslint-disable prefer-const */
        let {
            status, statusDisplayName, shippingStatus, shippingStatusDisplayName, isPickupOrder, buttonState, splitOrder
        } = this.props;
        /* eslint-enable prefer-const */

        const suffix = isSingle ? '' : '_shipment_' + (index + 1);

        if (OrderUtils.isElectronicShippingGroup(group)) {
            buttonState = OrderUtils.ORDER_TRACKING_BUTTON_STATES.PENDING;
        }

        const shouldShowTrackingLink = splitOrder && trackingUrl && (OrderUtils.isActive(status) || OrderUtils.isDelivered(status));

        const showSplitEDD = this.showSplitEDD(group?.shippingGroup);
        const promiseDateLabel = group?.shippingGroup?.shippingMethod?.promiseDateLabel;
        const promiseDateRange = group?.shippingGroup?.shippingMethod?.promiseDateRange;

        return (
            <div>
                {status && (
                    <div css={styles.infoRow}>
                        <h4
                            css={styles.infoRowLabel}
                            data-at={Sephora.debug.dataAt('status' + suffix)}
                            children={getText('status')}
                        />
                        {shouldShowTrackingLink ? (
                            <Link
                                href={trackingUrl}
                                color='blue'
                                target='_blank'
                                children={getText('seeTrackingDetails')}
                            />
                        ) : (
                            <OrderStatusDisplayName
                                orderStatusDisplayName={isPickupOrder ? statusDisplayName : shippingStatusDisplayName}
                                orderStatus={isPickupOrder ? status : shippingStatus}
                            />
                        )}
                    </div>
                )}
                <>
                    <div css={styles.infoRow}>
                        <h4
                            css={styles.infoRowLabel}
                            data-at={Sephora.debug.dataAt('shipping_method' + suffix)}
                            children={getText('shippingMethod')}
                        />
                        {group.shippingGroup.shippingMethod ? group.shippingGroup.shippingMethod.shippingMethodType : null}
                    </div>
                </>
                <>
                    <div css={styles.infoRow}>
                        {promiseDateLabel && !(isGiftCard && isUS) ? (
                            <>
                                <h4
                                    css={styles.infoRowLabel}
                                    children={promiseDateLabel}
                                />
                                {showSplitEDD && promiseDateRange
                                    ? dateUtils.getPromiseDateRange(promiseDateRange)
                                    : OrderUtils.getPromisedDelivery(group.shippingGroup)}
                            </>
                        ) : (
                            <>
                                <h4
                                    css={styles.infoRowLabel}
                                    data-at={Sephora.debug.dataAt('delivery_date' + suffix)}
                                    children={getText(hasHalAddress && !(isGiftCard && isUS) ? 'deliveryBy' : 'estimatedDelivery')}
                                />
                                {OrderUtils.getEstimatedDelivery(group.shippingGroup)}
                            </>
                        )}
                    </div>
                </>

                {!isGiftCard &&
                    this.renderTrackingNumber({
                        trackingNumber,
                        trackingUrl,
                        getText
                    })}

                {hasHalAddress && (
                    <React.Fragment>
                        <Grid
                            columns={[`${leftColWidth}px 1fr`, `${leftColWidth}px 1fr`]}
                            gap={0}
                            mb={2}
                        >
                            <Text
                                is='h2'
                                fontWeight='bold'
                            >
                                {getText(isCanada ? 'shipToPickupLocation' : 'shipToFeDexLocation')}
                            </Text>
                            <Address
                                address={address}
                                hasHalAddress={hasHalAddress}
                            />
                        </Grid>
                        <PickupPerson
                            address={address}
                            isCAOrder={isCanada}
                            isOrderDetail
                        />
                    </React.Fragment>
                )}

                {!hasHalAddress && (
                    <div css={styles.infoRow}>
                        <h4
                            css={styles.infoRowLabel}
                            data-at={Sephora.debug.dataAt('ship_to' + suffix)}
                            children={getText('shipTo')}
                        />
                        {group.shippingGroup && group.shippingGroup.address ? <Address address={address} /> : null}
                    </div>
                )}

                {this.renderTrackingButton({
                    buttonState,
                    trackingUrl
                })}

                {isFunction(renderSelfCancelationLink) && renderSelfCancelationLink()}
            </div>
        );
    };

    getBillingInfo = (getText, isGuestOrder) => {
        return (
            <>
                {this.props.paymentGroups.map((pg, index) => (
                    <React.Fragment key={index.toString()}>
                        {(pg.paymentGroup.address ||
                            pg.paymentGroupType === OrderUtils.CARD_TYPES.CreditCard ||
                            OrderUtils.isAlternativePaymentMethod(pg.paymentGroupType, pg.paymentGroup)) && (
                            <div css={[styles.infoRow, pg.paymentGroup.address || { alignItems: 'center' }]}>
                                <h4
                                    css={styles.infoRowLabel}
                                    children={getText('billingInfo')}
                                />
                                <div>
                                    {pg.paymentGroup.address && (
                                        <>
                                            <Address
                                                address={
                                                    isGuestOrder ? this.getGuestBillingAddress(pg.paymentGroup.address) : pg.paymentGroup.address
                                                }
                                            />
                                            {isGuestOrder || (
                                                <Text
                                                    is='div'
                                                    numberOfLines={1}
                                                    children={this.props.email}
                                                />
                                            )}
                                        </>
                                    )}
                                    {(!isGuestOrder ||
                                        pg.paymentGroupType === OrderUtils.CARD_TYPES.Klarna ||
                                        pg.paymentGroupType === OrderUtils.CARD_TYPES.Afterpay ||
                                        pg.paymentGroupType === OrderUtils.CARD_TYPES.Venmo ||
                                        pg.paymentGroupType === OrderUtils.CARD_TYPES.Paze) && (
                                        <div>
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
                                                        <Text style={{ fontWeight: pg.paymentGroupType === OrderUtils.CARD_TYPES.Venmo ? 'bold' : 'normal' }}>
                                                            {getText(OrderUtils.alternativePaymentText(pg.paymentGroupType, pg.paymentGroup))}
                                                        </Text>
                                                        {pg.paymentGroup.paymentDisplayInfo !== OrderUtils.CARD_TYPES.Paze && <br />}
                                                        {OrderUtils.alternativePaymentInfo(pg.paymentGroupType, pg.paymentGroup)}
                                                        {pg.paymentGroup.paymentDisplayInfo === OrderUtils.CARD_TYPES.Paze && (
                                                            <>
                                                                <br />
                                                                {`${
                                                                    OrderUtils.CREDIT_CARD_TYPES[pg.paymentGroup.cardType].displayName
                                                                } ${creditCardUtils.shortenCardNumber(pg.paymentGroup.cardNumber)}`}
                                                            </>
                                                        )}
                                                    </Text>
                                                </Grid>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
                {this.props.isAutoReplenOrder && (
                    <div css={styles.infoRow}>
                        <>
                            <h4
                                css={styles.infoRowLabel}
                                children={getText('autoReplenish')}
                            />
                        </>
                        <Link
                            href='/profile/MyAccount/AutoReplenishment'
                            color='blue'
                            target='_self'
                            children={getText('manageSubscriptions')}
                        />
                    </div>
                )}
            </>
        );
    };

    renderReturnText = () => {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/OrderDetail/locales', 'OrderShippingGroups');

        return (
            <div>
                <div css={styles.infoRow}>
                    <h4
                        css={styles.infoRowLabel}
                        children={getText('needToReturnSomething')}
                    />
                    <Text>{getText('returnText')}</Text>
                </div>
            </div>
        );
    };

    handleReturnLinkClick = function () {
        const shippingMethod = getOrderShippingMethod();
        returnLinkClick({ shippingMethod });
    };

    renderReturnDeliveryLink = (getText, orderId) => {
        const { isdeliveryLinkAvailable, isReturnable, showStartAndTrackAReturn } = this.props;
        const showDeliveryLink = Sephora?.configurationSettings?.enableSelfReship && isdeliveryLinkAvailable;

        return (
            <>
                <Divider marginY={4} />
                {isReturnable && (
                    <div css={styles.infoRow}>
                        <h4
                            css={styles.infoRowLabel}
                            children={getText('needToReturnSomething')}
                        />
                        <ReturnLink
                            orderId={this.props.orderId}
                            shipGroups={this.props.shipGroups}
                            onClickHandler={this.handleReturnLinkClick}
                            showStartAndTrackAReturn={showStartAndTrackAReturn}
                        />
                    </div>
                )}
                {showDeliveryLink ? (
                    <>
                        <Divider marginY={4} />
                        <div css={styles.infoRow}>
                            <h4
                                css={styles.infoRowLabel}
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

    smsOptInBanner = (getText, sameDayType) => {
        const smallViewport = !window.matchMedia(breakpoints.smMin).matches;

        return (
            <div>
                {userUtils.isBI() && this.state.optInAvailable === true ? (
                    <Box
                        is='div'
                        marginY={6}
                    >
                        {sameDayType === false ? (
                            <Divider
                                height={2}
                                marginY={[4, null, 5]}
                            />
                        ) : (
                            ''
                        )}
                        <Grid
                            gridTemplateColumns='1fr 7fr'
                            backgroundColor='#F6F6F8'
                            p={4}
                        >
                            <Image
                                src='/img/ufe/store/sms-evergreen-banner.svg'
                                marginX={[2, 8]}
                                width={46}
                                height={55}
                                marginY={2}
                            />
                            <Flex
                                display='flex'
                                flexDirection='row'
                                justifyContent='space-between'
                                alignContent='center'
                                alignItems='center'
                                flexWrap='wrap'
                                marginRight='12'
                            >
                                <Box>
                                    <Text
                                        is='h3'
                                        fontWeight='bold'
                                        fontSize='md'
                                        children={getText('bannerTitle')}
                                    />
                                    <Flex
                                        display='flex'
                                        flexDirection='row'
                                        alignItems='center'
                                        flexWrap='wrap'
                                        marginBottom={16}
                                    >
                                        <Text
                                            marginRight={1}
                                            is='p'
                                            fontSize='base'
                                            children={getText('bannerParagraph')}
                                        />
                                    </Flex>
                                </Box>
                                <Box>
                                    {smallViewport ? (
                                        <Box
                                            width={156}
                                            height={28}
                                        >
                                            <Button
                                                size='sm'
                                                variant='secondary'
                                                // block={true}
                                                children={getText('bannerButton')}
                                                onClick={this.handleRedirect}
                                            />
                                        </Box>
                                    ) : (
                                        <Button
                                            variant='secondary'
                                            block={true}
                                            children={getText('bannerButton')}
                                            onClick={this.handleRedirect}
                                        />
                                    )}
                                </Box>
                            </Flex>
                        </Grid>
                    </Box>
                ) : null}
            </div>
        );
    };

    componentDidMount() {
        const { smsStatus } = store.getState().user;

        if (smsStatus.isSMSOptInAvailable === true) {
            this.setState({
                optInAvailable: true
            });
        }
    }

    handleRedirect = () => {
        const { redirectTo } = urlUtils;

        return redirectTo(`/beauty/text-alerts?origin=${ORDER_DETAILS_PAGENAME}`);
    };

    determineReturnTextVisibility = (isReturnable, pickupOrderData = {}) => {
        const isSddReturnsEnabled = pickupOrderData.header?.isSddReturnsEnabled || false;
        const shippingStatus = pickupOrderData.header?.standardOrderStatus || '';

        return isSddReturnsEnabled && !isReturnable && (shippingStatus === IN_PROGRESS || shippingStatus === PLACED);
    };

    showSplitEDD = (shippingGroup, shippingGroupType) => {
        const { isSplitEDDEnabled } = this.props;
        const shippingMethod = shippingGroup?.shippingMethod || Empty.Object;
        const forceSplitEDDUI = shippingGroupType === SHIPPING_GROUPS.ELECTRONIC;

        const result = isSplitEDDEnabled && (forceSplitEDDUI || checkoutUtils.hasDeliveryGroups([shippingMethod]));

        return result;
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/OrderDetail/locales', 'OrderShippingGroups');

        const {
            shipGroups = [],
            pickupOrderData = [],
            isGuestOrder,
            isPickupOrder,
            isReturnable,
            orderLocale,
            isCanceledPickupOrder,
            isBopisOrder,
            renderStandardSectionHeader,
            sameDayType,
            isStandardOnly,
            isStandardMulti,
            isSameDayAndStandard,
            isSameDayOnly,
            renderSelfCancelationLink,
            isDeliveredSDDOrder,
            isShippedSDDOrder,
            autoReplenishItems,
            isSDUSubscriptionInOrder,
            isSelfServiceNCR,
            orderPriceInfo,
            orderId,
            isSplitEDDEnabled
        } = this.props;

        const shouldShowReturnText = this.determineReturnTextVisibility(isReturnable, pickupOrderData);
        const isCanada = orderLocale === 'CA';

        return (
            <>
                {isFunction(renderStandardSectionHeader) && renderStandardSectionHeader()}
                {shipGroups.length > 1 && this.getBillingInfo(getText, isGuestOrder, isCanada)}
                <Box
                    data-at={Sephora.debug.dataAt('shipment_section')}
                    lineHeight='tight'
                >
                    {shipGroups.length > 1 && (
                        <>
                            {this.renderReturnDeliveryLink(getText, orderId)}
                            {shouldShowReturnText && this.renderReturnText()}
                            {shipGroups.map((group, index) => (
                                <div
                                    data-at={Sephora.debug.dataAt('shipment_area')}
                                    key={index.toString()}
                                >
                                    <Divider
                                        height={2}
                                        marginY={[4, null, 5]}
                                        {...(isSplitEDDEnabled && {
                                            color: 'black'
                                        })}
                                    />
                                    <Text
                                        is='h3'
                                        fontSize='md'
                                        fontWeight='bold'
                                        marginBottom='1em'
                                    >
                                        {getText('shipment')} {index + 1}
                                    </Text>
                                    {this.getShipInfo({
                                        renderSelfCancelationLink,
                                        getText,
                                        group,
                                        isGuestOrder,
                                        isCanada,
                                        isSingle: false,
                                        index
                                    })}
                                    {/* Items List for STH + GC + EShipping */}
                                    <OrderItemList
                                        sameDayType={sameDayType}
                                        isOrderDetail={true}
                                        items={group.shippingGroup.items}
                                        isShippedSDDOrder={isShippedSDDOrder}
                                        isDeliveredSDDOrder={isDeliveredSDDOrder}
                                        shippingGroup={group.shippingGroup}
                                        shippingGroupType={group.shippingGroupType}
                                        showSplitEDD={this.showSplitEDD(group.shippingGroup, group.shippingGroupType)}
                                        customStyle={styles.splitEDDItemsList}
                                    />
                                    {(isStandardOnly || isStandardMulti) && (
                                        <>
                                            <Divider marginY={[4, null, 5]} />
                                            <OrderTotal
                                                isOrderDetail={true}
                                                dataAt={Sephora.debug.dataAt('description_shipment_' + (index + 1))}
                                                priceInfo={group.shippingGroup.priceInfo}
                                                orderLocale={orderLocale}
                                            />
                                        </>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                    {shipGroups.length === 1 && (
                        <>
                            {sameDayType || (
                                <div>
                                    <Grid
                                        columns={[null, null, 2]}
                                        alignItems='baseline'
                                        gap={null}
                                    >
                                        {this.getShipInfo({
                                            renderSelfCancelationLink,
                                            getText,
                                            group: shipGroups[0],
                                            isGuestOrder,
                                            isCanada,
                                            isSingle: true
                                        })}
                                        <div>
                                            <Divider
                                                display={[null, null, 'none']}
                                                marginY={4}
                                            />
                                            {this.getBillingInfo(getText, isGuestOrder, isCanada)}
                                            {this.renderReturnDeliveryLink(getText, orderId)}
                                            {shouldShowReturnText && this.renderReturnText()}
                                        </div>
                                    </Grid>
                                    {isStandardOnly ? this.smsOptInBanner(getText, sameDayType) : null}
                                </div>
                            )}
                            {isSameDayOnly ? this.smsOptInBanner(getText, sameDayType) : null}
                            {/* SDD + STH order details page */}
                            <OrderItemList
                                sameDayType={sameDayType}
                                isOrderDetail={true}
                                items={shipGroups[0].shippingGroup.items}
                                isShippedSDDOrder={isShippedSDDOrder}
                                isDeliveredSDDOrder={isDeliveredSDDOrder}
                                autoReplenishItems={autoReplenishItems}
                                isSDUSubscriptionInOrder={isSDUSubscriptionInOrder}
                                shippingGroup={shipGroups[0].shippingGroup}
                                showSplitEDD={this.showSplitEDD(shipGroups[0].shippingGroup)}
                                customStyle={!isSameDayOnly && styles.splitEDDItemsList}
                            />
                            {!isSameDayOnly && !isStandardOnly && !isSameDayAndStandard ? this.smsOptInBanner(getText, sameDayType) : null}
                            {(isStandardOnly || isStandardMulti) && (
                                <>
                                    <Divider marginY={[4, null, 5]} />
                                    <OrderTotal
                                        isSelfServiceNCR={isSelfServiceNCR}
                                        orderPriceInfo={orderPriceInfo}
                                        isOrderDetail={true}
                                        dataAt='description'
                                        priceInfo={shipGroups[0].shippingGroup.priceInfo}
                                        orderLocale={orderLocale}
                                    />
                                </>
                            )}
                        </>
                    )}
                    {isPickupOrder && (
                        <OrderItemList
                            isOrderDetail={true}
                            isPickupOrder={isPickupOrder}
                            orderStatus={pickupOrderData.header.status}
                            items={pickupOrderData.pickup.items}
                            isCanceledPickupOrder={isCanceledPickupOrder}
                            priceInfo={pickupOrderData.priceInfo}
                            pickupBasket={pickupOrderData}
                            isBopisOrder={isBopisOrder}
                        />
                    )}
                    {isBopisOrder ? this.smsOptInBanner(getText, sameDayType) : null}
                </Box>
            </>
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
    infoRowLabel: [
        headingStyle,
        {
            flexShrink: 0,
            width: itemWidths.IMAGE + space[5],
            paddingRight: space[3],
            wordBreak: 'break-word'
        }
    ],
    splitEDDItemsList: { root: { marginTop: space[5] } }
};

export default wrapComponent(OrderShippingGroups, 'OrderShippingGroups', true);
