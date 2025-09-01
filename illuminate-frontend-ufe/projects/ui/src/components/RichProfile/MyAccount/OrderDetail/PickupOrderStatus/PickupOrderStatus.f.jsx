import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Grid, Link, Image, Text
} from 'components/ui';
import { colors, space } from 'style/config';
import storeUtils from 'utils/Store';
import postCheckoutUtils from 'utils/PostCheckout';
import OrderUtils from 'utils/Order';
import StoreHours from 'components/Stores/StoreDetails/StoreHours';
import Address from 'components/Addresses/Address';
import Markdown from 'components/Markdown/Markdown';
import CurbsidePickupIndicator from 'components/CurbsidePickupIndicator';
import ConciergeCurbsidePickupIndicator from 'components/ConciergeCurbsidePickupIndicator';
import localeUtils from 'utils/LanguageLocale';
import urlUtils from 'utils/Url';
import actions from 'actions/Actions';
import store from 'Store';
import { itemWidths } from 'components/Product/ProductListItem/constants';
import orderUtils from 'utils/Order';
import OrderStatusDisplayName from 'components/RichProfile/MyAccount/OrderDetail/OrderStatusDisplayName/OrderStatusDisplayName';
import AlternatePickup from 'components/Checkout/Sections/AlternatePickup';

const { HEADER_LEVEL_ORDER_STATUS } = orderUtils.ROPIS_CONSTANTS;

const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/OrderDetail/PickupOrderStatus/locales', 'PickupOrderStatus');

const getTextForPaymentDisplay = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/OrderDetail/locales', 'OrderShippingGroups');

function getBillingInfo({
    isGuestOrder, isCanada, paymentGroups, email, doubleColumn
}) {
    const isMobile = Sephora.isMobile();
    const Component = doubleColumn ? React.Fragment : 'div';

    return paymentGroups.map((pg, index) => (
        <React.Fragment key={index.toString()}>
            {(pg.paymentGroup.address ||
                pg.paymentGroupType === OrderUtils.CARD_TYPES.CreditCard ||
                OrderUtils.isAlternativePaymentMethod(pg.paymentGroupType, pg.paymentGroup)) && (
                <Component css={isMobile || styles.infoRow}>
                    <h4
                        data-at={Sephora.debug.dataAt('order_billing_label')}
                        css={isMobile ? styles.label : styles.infoRowLabel}
                        children={getText('billingInfo')}
                    />
                    <div data-at={Sephora.debug.dataAt('order_billing_info')}>
                        {pg.paymentGroup.address && (
                            <>
                                <Address address={isGuestOrder ? this.getGuestBillingAddress(pg.paymentGroup.address) : pg.paymentGroup.address} />
                                {isGuestOrder || (
                                    <Text
                                        is='div'
                                        numberOfLines={1}
                                        children={email}
                                    />
                                )}
                            </>
                        )}
                        {(isGuestOrder && pg.paymentGroupType !== OrderUtils.CARD_TYPES.Klarna) || (
                            <div>
                                {pg.paymentGroupType === OrderUtils.CARD_TYPES.CreditCard && pg.paymentGroup.cardNumber}
                                {OrderUtils.isAlternativePaymentMethod(pg.paymentGroupType, pg.paymentGroup) && (
                                    <Grid
                                        marginTop={3}
                                        columns='auto 1fr'
                                        gap={2}
                                        alignItems='center'
                                    >
                                        <Image
                                            {...OrderUtils.alternativePaymentAltSrc(pg.paymentGroupType, pg.paymentGroup, isCanada)}
                                            width={52}
                                            height={33}
                                        />
                                        <Text numberOfLines={1}>
                                            {getTextForPaymentDisplay(OrderUtils.alternativePaymentText(pg.paymentGroupType, pg.paymentGroup))}
                                            <br />
                                            {OrderUtils.alternativePaymentInfo(pg.paymentGroupType, pg.paymentGroup, isCanada)}
                                        </Text>
                                    </Grid>
                                )}
                            </div>
                        )}
                    </div>
                </Component>
            )}
        </React.Fragment>
    ));
}

function PickupOrderStatus({
    orderId,
    isPickedUp,
    isCanceledPickupOrder,
    isReadyToPickUp,
    isProcessing,
    isAltPickPersonEnabledAfterOrdPlace,
    isOmsAckedForAltPickupUpdate,
    orderStatusDisplayName,
    pickupOrder,
    isGuestOrder,
    orderLocale,
    paymentGroups,
    status,
    email,
    statusDescription,
    isBopisOrder
}) {
    const isCanada = orderLocale === 'CA';
    const processing = status === HEADER_LEVEL_ORDER_STATUS.PROCESSING;
    const { storeDetails, pickupMethods } = pickupOrder;
    const isInStorePickup = postCheckoutUtils.isInStorePickup(pickupMethods);
    const curbsideEnabled = storeUtils.isCurbsideEnabled(storeDetails, { isBopisOrder });
    const conciergeCurbsideEnabled = storeUtils.isConciergeCurbsideEnabled(storeDetails, { isBopisOrder });
    const showConciergeCurbsidePickupIndicator = curbsideEnabled && !isInStorePickup && conciergeCurbsideEnabled;
    const showCurbsidePickupIndicator = curbsideEnabled && !conciergeCurbsideEnabled;

    return (
        <>
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
                    data-at={Sephora.debug.dataAt('order_status_label')}
                />
                <div>
                    <OrderStatusDisplayName
                        orderStatusDisplayName={orderStatusDisplayName}
                        orderStatus={status}
                    />
                    {isCanceledPickupOrder && (
                        <div>
                            <p>{statusDescription}</p>
                            <Link
                                color='blue'
                                data-at={Sephora.debug.dataAt('see_faqs_link')}
                                children={getText('seeFaqs')}
                                href='/beauty/in-store-pick-up-faq'
                            />
                        </div>
                    )}
                </div>
                {!isCanceledPickupOrder && isPickedUp && (
                    <>
                        <strong
                            children={getText('pickedUp')}
                            data-at={Sephora.debug.dataAt('order_picked_up_label')}
                        />
                        <span
                            children={pickupOrder.pickedUpDate}
                            data-at={Sephora.debug.dataAt('order_picked_up_info')}
                        />
                    </>
                )}
                <strong
                    children={getText('pickupStoreLabel')}
                    data-at={Sephora.debug.dataAt('order_pickup_store_label')}
                />
                <dl>
                    <dt
                        css={{ fontWeight: 'var(--font-weight-bold)' }}
                        data-at={Sephora.debug.dataAt('store_name')}
                    >
                        {storeUtils.getStoreDisplayNameWithSephora(pickupOrder.storeDetails)}
                    </dt>
                    {showCurbsidePickupIndicator && (
                        <CurbsidePickupIndicator
                            is='dd'
                            marginBottom={3}
                            dataAt='curbside_indicator_label'
                        />
                    )}
                    {showConciergeCurbsidePickupIndicator && (
                        <ConciergeCurbsidePickupIndicator
                            is='dd'
                            marginBottom={3}
                            dataAt='concierge_indicator_label'
                        />
                    )}
                    <dd data-at={Sephora.debug.dataAt('store_info')}>{pickupOrder.storeDetails.address.address1}</dd>
                    {pickupOrder.storeDetails.address.address2 && (
                        <dd data-at={Sephora.debug.dataAt('store_info')}>{pickupOrder.storeDetails.address.address2}</dd>
                    )}
                    <dd
                        data-at={Sephora.debug.dataAt('store_info')}
                    >{`${pickupOrder.storeDetails.address.city}, ${pickupOrder.storeDetails.address.state} ${pickupOrder.storeDetails.address.postalCode}`}</dd>
                    <dd data-at={Sephora.debug.dataAt('store_info')}>{pickupOrder.storeDetails.address.phone}</dd>
                    <dd css={{ marginTop: '1em' }}>
                        <StoreHours storeHoursDisplay={storeUtils.getStoreHoursDisplayArray(pickupOrder.storeDetails.storeHours)} />
                    </dd>
                    <dd>
                        <Link
                            data-at={Sephora.debug.dataAt('map_button')}
                            color='blue'
                            padding={1}
                            margin={-1}
                            onClick={() => {
                                //needed to work properly for mobile devices
                                urlUtils.openLinkInNewTab(urlUtils.getDirectionsUrl(pickupOrder.storeDetails.address));

                                return false;
                            }}
                            children={getText('mapLink')}
                        />
                        <span
                            css={{
                                color: colors.midGray,
                                margin: '0 .5em'
                            }}
                            children='|'
                        />
                        <Link
                            data-at={Sephora.debug.dataAt('store_details_button')}
                            color='blue'
                            padding={1}
                            margin={-1}
                            onClick={() => {
                                store.dispatch(
                                    actions.showFindInStoreMapModal({
                                        isOpen: true,
                                        currentProduct: null,
                                        selectedStore: pickupOrder.storeDetails
                                    })
                                );
                            }}
                            children={getText('storeDetailsLink')}
                        />
                    </dd>
                </dl>
                {!isPickedUp && (
                    <>
                        <strong
                            children={getText('pickupPerson')}
                            data-at={Sephora.debug.dataAt('order_pickup_person_label')}
                        />
                        <div data-at={Sephora.debug.dataAt('order_pickup_person_info')}>
                            <div>
                                <span>{pickupOrder.firstname} </span>
                                <span>{pickupOrder.lastName}</span>
                            </div>
                            <span children={pickupOrder.email} />
                            {(pickupOrder.altPickupPersonDetails || isAltPickPersonEnabledAfterOrdPlace) && (
                                <AlternatePickup
                                    marginY={4}
                                    compactView={true}
                                    isOrderDetails={true}
                                    isOmsAckedForAltPickupUpdate={isOmsAckedForAltPickupUpdate}
                                    allowEdit={!isCanceledPickupOrder && isAltPickPersonEnabledAfterOrdPlace}
                                    orderId={orderId}
                                    alternatePickupData={pickupOrder.altPickupPersonDetails}
                                />
                            )}
                            {!isCanceledPickupOrder && processing ? (
                                <Markdown
                                    backgroundColor='nearWhite'
                                    paddingY={2}
                                    paddingX={3}
                                    borderRadius={2}
                                    lineHeight='tight'
                                    marginTop={2}
                                    content={getText('confirmationId')}
                                />
                            ) : null}
                        </div>
                    </>
                )}
                <>
                    {(isProcessing || isReadyToPickUp || isPickedUp) &&
                        getBillingInfo({
                            isGuestOrder,
                            isCanada,
                            paymentGroups,
                            email,
                            doubleColumn: true
                        })}
                </>
            </Grid>
            {isCanceledPickupOrder &&
                getBillingInfo({
                    isGuestOrder,
                    isCanada,
                    paymentGroups,
                    email,
                    doubleColumn: false
                })}
        </>
    );
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
            paddingRight: space[3]
        }
    ]
};

export default wrapFunctionalComponent(PickupOrderStatus, 'PickupOrderStatus');
