/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { colors, radii } from 'style/config';
import {
    Flex, Text, Link, Box, Divider
} from 'components/ui';
import Chevron from 'components/Chevron/Chevron';
import ItemsInOrder from 'components/RwdCheckout/OrderSummary/ItemsInOrder';
import OrderTotalSection from 'components/RwdCheckout/OrderSummary/OrderTotalSection';
import orderUtils from 'utils/Order';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import userUtils from 'utils/User';
import UI from 'utils/UI';
import processEvent from 'analytics/processEvent';
import analyticsConsts from 'analytics/constants';
import CheckoutItemsList from 'components/RwdCheckout/OrderSummary/CheckoutItemsList';
import { mediaQueries } from 'style/config';
import MediaUtils from 'utils/Media';
const { Media } = MediaUtils;

class OrderSummary extends BaseClass {
    state = {
        priceInfo: null,
        items: null,
        promotion: null,
        isCanada: false,
        itemsInOrderExpanded: this.props.showCheckoutExpandOrderList ?? false
    };

    componentDidMount() {
        this.setState({
            isCanada: localeUtils.isCanada(),
            isUS: userUtils.getShippingCountry().countryCode === localeUtils.COUNTRIES.US
        });

        store.setAndWatch('order.orderDetails', this, async data => {
            if (data.orderDetails) {
                const {
                    priceInfo, items, promotion = {}, header = { isComplete: false }, paymentGroups = {}
                } = data.orderDetails;

                const prevState = { ...this.state };

                const itemsInOrderExpanded =
                    header.isComplete ||
                    orderUtils.isHazardous(items.items) ||
                    orderUtils.isRestrictedInCalifornia(items.items) ||
                    this.state.itemsInOrderExpanded;
                const merchandiseSubtotal = await orderUtils.calculateMerchandiseSubtotal(priceInfo);
                this.setState(
                    {
                        priceInfo,
                        items: items,
                        merchandiseTotal: merchandiseSubtotal,
                        promotion,
                        itemsInOrderExpanded,
                        isPlayOrder: orderUtils.isPlayOrder(),
                        isPlayEditOrder: orderUtils.isPlayEditOrder(),
                        paymentGroups
                    },
                    () => {
                        // if OrderSummary has just expanded or retracted,
                        // then the scroll position for IOS might need adjustment
                        prevState.itemsInOrderExpanded !== itemsInOrderExpanded && this.adjustScrollPositionForIOS();
                    }
                );
            }
        });
    }

    adjustScrollPositionForIOS = () => {
        // only adjust the scroll position for Guest Checkout on Mobile for IOS
        if (this.props.isGuestCheckout && UI.isIOS()) {
            const node = ReactDOM.findDOMNode(this.itemsInOrderPanel);

            if (this.state.itemsInOrderExpanded && node && node.offsetTop) {
                // if the OrderSummary was expanded, adjust the window scroll position by the offsetHeight of OrderSummary
                const offset = node.offsetHeight - 45;
                window.scrollBy(0, offset);
            } else {
                // else the OrderSummary was retracted, therefore adjust the window scroll position to the top of the window
                window.scrollTo(0, 0);
            }
        }
    };

    toggleOrderItems = () => {
        this.setState(
            { itemsInOrderExpanded: !this.state.itemsInOrderExpanded },
            () => !this.state.itemsInOrderExpanded && this.adjustScrollPositionForIOS()
        );

        //Analytics
        processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
            data: {
                eventStrings: [analyticsConsts.Event.EVENT_71],
                linkName: 'D=c55',
                actionInfo: `${analyticsConsts.PAGE_TYPES.CHECKOUT}:items in order`
            }
        });
    };

    renderItemList = (orderItems, itemsVisibles) => {
        const { isBopis, isRopis } = this.props;

        return (
            <CheckoutItemsList
                basketType={isRopis || isBopis ? 'bopis' : 'shipped'}
                items={orderItems.items}
                itemsCount={orderItems.itemCount}
                itemsVisibles={itemsVisibles}
            />
        );
    };

    render() {
        const orderItems = this.state.items || {};
        const { isGuestCheckout, hideOrderSummary, showOrderSummary, editBasket } = this.props;

        const { priceInfo } = this.state;

        const {
            isBopis, isConfirmation = false, isRopis, sddBasketHasItems, isAutoReplenishBasket
        } = this.props;

        return priceInfo && priceInfo.orderTotal ? (
            <div
                css={!isRopis && !(isBopis && isConfirmation) && [styles.box, styles.root]}
                data-at={Sephora.debug.dataAt('order_summary')}
            >
                {isGuestCheckout && sddBasketHasItems && !isRopis && (
                    <OrderTotalSection
                        isAutoReplenishBasket={isAutoReplenishBasket}
                        isBopis={isBopis}
                        sddBasketHasItems={sddBasketHasItems}
                        {...this.state}
                    />
                )}
                {isGuestCheckout && !sddBasketHasItems && (
                    <Box
                        ref={itemsInOrderPanel => (this.itemsInOrderPanel = itemsInOrderPanel)}
                        backgroundColor='nearWhite'
                        boxShadow='0 3px 4px -1px var(--color-darken2)'
                    >
                        <Divider />
                        <Link
                            aria-expanded={this.state.itemsInOrderExpanded}
                            aria-controls='order_items'
                            display='block'
                            width='100%'
                            onClick={this.toggleOrderItems}
                            data-at={Sephora.debug.dataAt('show_items')}
                        >
                            <Flex
                                is='span'
                                paddingX='container'
                                paddingY={3}
                                justifyContent='space-between'
                                alignItems='center'
                            >
                                <Chevron
                                    marginRight='.5em'
                                    direction={this.state.itemsInOrderExpanded ? 'up' : 'down'}
                                />
                                <Text
                                    flex='1'
                                    css={{ textTransform: 'uppercase' }}
                                >
                                    {this.state.itemsInOrderExpanded ? hideOrderSummary : showOrderSummary}
                                </Text>
                                <b children={priceInfo.orderTotal} />
                            </Flex>
                        </Link>
                        <div
                            id='order_items'
                            data-at={Sephora.debug.dataAt('items_section')}
                            style={
                                !this.state.itemsInOrderExpanded
                                    ? {
                                        display: 'none'
                                    }
                                    : null
                            }
                        >
                            <Divider />

                            {orderItems.itemCount > 0 ? this.getOrderItemsList(orderItems) : null}

                            <Divider />

                            <Box
                                paddingY={4}
                                paddingX='container'
                            >
                                <Flex justifyContent='center'>
                                    <Link
                                        href='/basket?icid2=checkout:edit-basket-link'
                                        padding={3}
                                        margin={-3}
                                        lineHeight='tight'
                                        color='blue'
                                        children={editBasket}
                                    />
                                </Flex>
                                <Divider marginY={4} />

                                {isRopis || (
                                    <OrderTotalSection
                                        isAutoReplenishBasket={isAutoReplenishBasket}
                                        isBopis={isBopis}
                                        sddBasketHasItems={sddBasketHasItems}
                                        isGuestCheckout={isGuestCheckout}
                                        {...this.state}
                                    />
                                )}

                                <Flex justifyContent='center'>
                                    <Link
                                        padding={3}
                                        margin={-3}
                                        lineHeight='tight'
                                        color='blue'
                                        arrowPosition='before'
                                        arrowDirection={this.state.itemsInOrderExpanded ? 'up' : 'down'}
                                        onClick={this.toggleOrderItems}
                                    >
                                        {hideOrderSummary}
                                    </Link>
                                </Flex>
                            </Box>
                        </div>
                    </Box>
                )}

                {isGuestCheckout || (
                    <React.Fragment>
                        {isRopis || (
                            <OrderTotalSection
                                isAutoReplenishBasket={isAutoReplenishBasket}
                                isBopis={isBopis}
                                isConfirmation={isConfirmation}
                                sddBasketHasItems={sddBasketHasItems}
                                {...this.state}
                            />
                        )}
                        {!sddBasketHasItems && !isAutoReplenishBasket && (
                            <>
                                <Divider
                                    marginTop={['13px', 0]}
                                    marginBottom={['3px', 0]}
                                    marginX={[0, 16]}
                                />
                                <Box
                                    paddingX={[0, 4]}
                                    paddingY={[2, 3]}
                                >
                                    <Media lessThan='sm'>{this.renderItemList(orderItems, 6)}</Media>
                                    <Media greaterThan='xs'>{this.renderItemList(orderItems, 5)}</Media>
                                </Box>
                            </>
                        )}
                    </React.Fragment>
                )}
            </div>
        ) : null;
    }
    getOrderItemsList = orderItems => {
        const { isRopis, isBopis } = this.props;
        const isPickupOrder = isRopis || isBopis;

        return (
            <Box padding={4}>
                {orderItems &&
                    orderItems.items &&
                    orderItems.items.map((item, index) => (
                        //revisit this
                        <React.Fragment key={item.commerceId}>
                            {index > 0 && <Divider marginY={3} />}
                            {item.isGlobalPromotion || (
                                <ItemsInOrder
                                    isUS={this.state.isUS}
                                    isCanada={this.state.isCanada}
                                    isPickupOrder={isPickupOrder}
                                    item={item}
                                />
                            )}
                        </React.Fragment>
                    ))}
            </Box>
        );
    };
}

const styles = {
    root: {
        [mediaQueries.sm]: {
            position: 'sticky',
            top: 0
        }
    },
    box: {
        [mediaQueries.sm]: {
            borderRadius: radii[2],
            borderWidth: 1,
            borderColor: colors.midGray
        }
    }
};

export default wrapComponent(OrderSummary, 'OrderSummary');
