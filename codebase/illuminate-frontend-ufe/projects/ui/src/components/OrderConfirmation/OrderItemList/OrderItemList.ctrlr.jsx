import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Text, Divider } from 'components/ui';
import { space, mediaQueries, colors } from 'style/config';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import OrderItem from 'components/OrderConfirmation/OrderItemList/OrderItem/OrderItem';
import ProductListItem from 'components/Product/ProductListItem/ProductListItem';
import SplitEDDItemsList from 'components/SharedComponents/SplitEDD/SplitEDDItemsList';
import localeUtils from 'utils/LanguageLocale';
import orderUtils from 'utils/Order';
import deliveryFrequencyUtils from 'utils/DeliveryFrequency';
import * as productListItemConstants from 'components/Product/ProductListItem/constants';
import * as orderConfirmationConstants from 'components/OrderConfirmation/constants';

const { extractReplenishFrequency } = deliveryFrequencyUtils;
const { ROPIS_CONSTANTS } = orderUtils;
const { HEADER_LEVEL_ORDER_STATUS } = ROPIS_CONSTANTS;
const { SHIPPING_GROUPS } = orderUtils;

const FIRST_ITEM_INDEX = 0;
import RopisBasketOrderSummary from 'components/RopisBasketOrderSummary';

function swapSubstitutedItem(item) {
    let firstChoiceItem = { ...item };
    let substituteItem = item.substituteSku ? { ...item.substituteSku } : undefined;

    if (item.isSubstituted && item.substituteSku) {
        const { isSubstituted, substituteSku, ...restFirstChoiceItem } = item;

        firstChoiceItem = { ...substituteSku, isSubstituted };
        substituteItem = { ...restFirstChoiceItem };
    }

    return { firstChoiceItem, substituteItem };
}

function productListItem(item, autoReplenishItems, isSDUSubscriptionInOrder, substituteItemOpts = {}) {
    const autoReplenishFrequency = extractReplenishFrequency(item, autoReplenishItems);
    const { firstChoiceItem, substituteItem } = swapSubstitutedItem(item);
    const { showSubstituteOrPolicy = false, forceOutOfStockLabel = false } = substituteItemOpts;

    return (
        <ProductListItem
            isOrderDetail='true'
            sku={firstChoiceItem.sku}
            product={firstChoiceItem.product}
            qty={firstChoiceItem.qty}
            amount={firstChoiceItem.itemTotal}
            listPrice={firstChoiceItem.listPrice}
            replenishmentPaymentDate={item.replenishmentPaymentDate}
            autoReplenishFrequency={autoReplenishFrequency}
            isSDUSubscriptionInOrder={isSDUSubscriptionInOrder}
            substituteItem={substituteItem}
            isSubstitutedItem={firstChoiceItem.isSubstituted}
            showSubstituteOrPolicy={showSubstituteOrPolicy}
            forceOutOfStockLabel={forceOutOfStockLabel}
        />
    );
}

function itemListTitle(children, color) {
    return (
        <Text
            is='h2'
            fontWeight='bold'
            marginY={4}
            marginX={['-container', null, 0]}
            paddingY={3}
            paddingX={['container', null, 6]}
            color={color}
            backgroundColor='nearWhite'
            children={children}
        />
    );
}

class OrderItemList extends BaseClass {
    state = { isUS: false };

    productListItemForSplitEDD = item => {
        const { autoReplenishItems } = this.props;

        return productListItem(item, autoReplenishItems);
    };

    getDividerCSS = () => {
        const { isSDUOrderOnly, sameDayType } = this.props;
        let borderBottom = `2px solid ${isSDUOrderOnly ? colors.nearWhite : colors.black}`;

        // When Split EDD killswitch is enabled, update the SDD order divider
        // style to match the Split EDD Items List for a better visual experience.
        // SDD was out of scope for Split EDD and we don't want to make a bigger update here.

        const splitEDDExperience = Sephora.configurationSettings?.splitEDDConfiguration?.isSplitEDDEnabled;

        if (splitEDDExperience) {
            if (sameDayType) {
                borderBottom = `1px solid ${colors.lightGray}`;
            }
        }

        return {
            borderBottom
        };
    };

    /* eslint-disable-next-line complexity */
    render() {
        const getText = localeUtils.getLocaleResourceFile('components/OrderConfirmation/OrderItemList/locales', 'OrderItemList');

        const {
            customStyle = {},
            isBopisOrder,
            isCanceledPickupOrder,
            isOrderDetail,
            isPickupOrder,
            items,
            orderStatus = '',
            pickupBasket,
            priceInfo,
            sameDayType,
            isShippedSDDOrder,
            isDeliveredSDDOrder,
            autoReplenishItems,
            sduListPrice,
            skuTrialPeriod,
            sduRenewDate,
            isSDUSubscriptionInOrder,
            isSDUTrial,
            showItemSubstitution,
            shippingGroup,
            shippingGroupType,
            showSplitEDD
        } = this.props;

        const redeemedPoints = pickupBasket?.biPoints?.redeemedPoints || pickupBasket?.items?.redeemedBiPoints;
        const { itemWidths } = isOrderDetail ? productListItemConstants : sameDayType ? productListItemConstants : orderConfirmationConstants;
        let fulfilledItems;
        let reservedItems;
        let unfulfillableItems;
        let readyForPickUpcanceledItems;
        let pickedUpcanceledItems;

        let unavailableSDDItems;
        let notDeliveredSDDItems;
        let deliveredSDDItems;

        if (isPickupOrder) {
            /* Order Status         |   Item Status     |   Grouping
             * ------------------------------------------------------------
             * Processing           |   Processing      |   No Grouping
             *                      |                   |
             * Ready for Pick up    |   Reserved        |   Items Ready for Pickup
             *                      |   Unfulfillable   |   Out of Stock Items
             *                      |   Canceled        |   Unavailable or Canceled Items
             * Picked Up            |   Fulfilled       |   Picked up Items
             *                      |   Canceled        |   Unavailable or Canceled Items
             *                      |   Unfulfillable   |   Unavailable or Canceled Items
             * Canceled             |                   |   No Grouping
             * -------------------------------------------------------------
             */

            /*
            Item Substitution:

            status === 'Canceled' and isSubstituted === true, means the first choice item is canceled,
            but the subsitution will occur at store and the substitute item is reserved (Ready for Pick up).
            Items will also be shown in the Picked Up Items list when order is in Picked Up status.

            An item with status === 'Canceled' and isSubstituted === true, is not going to be shown
            on any of the Canceled Items lists.

            status === 'Canceled' and isSubstituted === false, means the item is canceled for real
            */

            reservedItems = items.filter(item => item.status === 'Reserved' || (item.status === 'Canceled' && item.isSubstituted));
            unfulfillableItems = items.filter(item => item.status === 'Unfulfillable');
            readyForPickUpcanceledItems = items.filter(item => item.status === 'Canceled' && !item.isSubstituted);
            pickedUpcanceledItems = items.filter(item => item.status === 'Unfulfillable' || (item.status === 'Canceled' && !item.isSubstituted));
            fulfilledItems = items.filter(item => item.status === 'Fulfilled' || (item.status === 'Canceled' && item.isSubstituted));
        } else if (sameDayType) {
            /* For SDD, per CE team, item.status does not get updated for delivered items so need to look at order header and canceled items */
            unavailableSDDItems = items.filter(item => item.status === 'Canceled' && !item.isSubstituted);
            notDeliveredSDDItems =
                !isDeliveredSDDOrder && items.filter(item => item.status !== 'Canceled' || (item.status === 'Canceled' && item.isSubstituted));
            deliveredSDDItems =
                isDeliveredSDDOrder && items.filter(item => item.status !== 'Canceled' || (item.status === 'Canceled' && item.isSubstituted));
        }

        const isOrderProcessing = orderStatus === HEADER_LEVEL_ORDER_STATUS.PROCESSING;
        const isOrderCanceled = orderStatus === HEADER_LEVEL_ORDER_STATUS.CANCELED;

        const showLegacyList = !showSplitEDD;
        const showSplitEDDList = showSplitEDD && !(isPickupOrder || sameDayType);
        const isElectronicShippingGroup = shippingGroupType === SHIPPING_GROUPS.ELECTRONIC;

        const orderItemComponentProps = {
            isUS: this.state.isUS,
            sduListPrice: sduListPrice,
            skuTrialPeriod: skuTrialPeriod,
            isSDUTrial: isSDUTrial,
            sduRenewDate: sduRenewDate,
            isSDUSubscriptionInOrder: isSDUSubscriptionInOrder,
            showItemSubstitution: showItemSubstitution
        };

        const dividerCSS = this.getDividerCSS();

        return (
            <div>
                <Box css={[styles.header, customStyle.header, showSplitEDDList ? styles.noHeader : null]}>
                    <Divider
                        marginBottom={4}
                        css={dividerCSS}
                    />
                    <LegacyGrid
                        lineHeight='tight'
                        fontWeight='bold'
                        gutter={6}
                    >
                        <LegacyGrid.Cell width={itemWidths.DESC}>
                            <Text
                                paddingLeft={6}
                                children={getText('item')}
                            />
                        </LegacyGrid.Cell>
                        <LegacyGrid.Cell width={itemWidths.PRICE}>{getText('price')}</LegacyGrid.Cell>
                        <LegacyGrid.Cell width={itemWidths.QTY}>{getText('qty')}</LegacyGrid.Cell>
                        <LegacyGrid.Cell
                            width={itemWidths.AMOUNT}
                            textAlign='right'
                        >
                            {getText('amount')}
                        </LegacyGrid.Cell>
                        {isOrderDetail && <LegacyGrid.Cell width={itemWidths.ACTION} />}
                    </LegacyGrid>
                </Box>
                {showLegacyList && !(isPickupOrder || sameDayType) && Array.isArray(items) && (
                    <>
                        {items.map((item, index) => (
                            // revisit this
                            <div key={item.commerceId}>
                                <Divider marginY={4} />
                                {isOrderDetail ? (
                                    productListItem(item, autoReplenishItems)
                                ) : (
                                    <OrderItem
                                        isPageRenderImg={index === FIRST_ITEM_INDEX}
                                        loveSource='purchaseHistory'
                                        item={item}
                                        isUS={this.state.isUS}
                                        sduListPrice={sduListPrice}
                                        skuTrialPeriod={skuTrialPeriod}
                                        isSDUTrial={isSDUTrial}
                                        sduRenewDate={sduRenewDate}
                                        isSDUSubscriptionInOrder={isSDUSubscriptionInOrder}
                                        showItemSubstitution={showItemSubstitution}
                                    />
                                )}
                            </div>
                        ))}
                    </>
                )}

                {showSplitEDDList && (
                    <SplitEDDItemsList
                        isOrderDetail={isOrderDetail}
                        shippingGroupType={shippingGroupType}
                        shippingGroup={shippingGroup}
                        orderItemComponentProps={orderItemComponentProps}
                        productListItemForSplitEDD={this.productListItemForSplitEDD}
                        customStyle={customStyle}
                        showHeader={!isElectronicShippingGroup}
                        createDeliveryGroup={isElectronicShippingGroup}
                    />
                )}

                {sameDayType && (
                    <>
                        {unavailableSDDItems.length === 0 ? (
                            items.map(item => {
                                const showItemSub = isShippedSDDOrder || isDeliveredSDDOrder ? item.isSubstituted : true;

                                return (
                                    <div key={item.commerceId}>
                                        <Divider marginY={4} />
                                        {productListItem(item, [], isSDUSubscriptionInOrder, {
                                            showSubstituteOrPolicy: showItemSub,
                                            forceOutOfStockLabel: item.isSubstituted
                                        })}
                                    </div>
                                );
                            })
                        ) : (
                            <>
                                {deliveredSDDItems.length > 0 && (
                                    <>
                                        {itemListTitle(getText('deliveredItems'), 'black')}
                                        {deliveredSDDItems.map((item, index) => (
                                            <div key={item.commerceId}>
                                                {index !== FIRST_ITEM_INDEX && <Divider marginY={4} />}
                                                {productListItem(item, [], false, {
                                                    showSubstituteOrPolicy: item.isSubstituted,
                                                    forceOutOfStockLabel: true
                                                })}
                                            </div>
                                        ))}
                                    </>
                                )}
                                {itemListTitle(getText('unavailableItems'), 'red')}
                                {/* Unavailable Items list */}
                                {unavailableSDDItems.map((item, index) => (
                                    <div key={item.commerceId}>
                                        {index !== FIRST_ITEM_INDEX && <Divider marginY={4} />}
                                        {productListItem(item, [], false, {
                                            showSubstituteOrPolicy: !!item.substituteSku,
                                            forceOutOfStockLabel: true
                                        })}
                                    </div>
                                ))}
                                {/* Items Getting Delivered list */}
                                {notDeliveredSDDItems.length > 0 && (
                                    <>
                                        {itemListTitle(getText('notDeliveredItems'), 'black')}
                                        {notDeliveredSDDItems.map((item, index) => (
                                            <div key={item.commerceId}>
                                                {index !== FIRST_ITEM_INDEX && <Divider marginY={4} />}
                                                {productListItem(item, [], false, {
                                                    showSubstituteOrPolicy: item.isSubstituted,
                                                    forceOutOfStockLabel: true
                                                })}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}

                {isPickupOrder && (
                    <React.Fragment>
                        {(isOrderProcessing || isOrderCanceled) &&
                            items.length > 0 &&
                            items.map(item => (
                                <div key={item.commerceId}>
                                    <Divider marginY={4} />
                                    {productListItem(item, [], false, {
                                        showSubstituteOrPolicy: isOrderProcessing || !!item.substituteSku,
                                        forceOutOfStockLabel: false
                                    })}
                                </div>
                            ))}
                        {orderStatus === HEADER_LEVEL_ORDER_STATUS.READY_FOR_PICK_UP && unfulfillableItems.length > 0 && (
                            <React.Fragment>
                                {itemListTitle(getText('oosItems'), 'red')}
                                {unfulfillableItems.map((item, index) => (
                                    <div key={item.commerceId}>
                                        {index !== FIRST_ITEM_INDEX && <Divider marginY={4} />}
                                        {productListItem(item, [], false, {
                                            showSubstituteOrPolicy: item.isSubstituted,
                                            forceOutOfStockLabel: true
                                        })}
                                    </div>
                                ))}
                            </React.Fragment>
                        )}
                        {orderStatus === HEADER_LEVEL_ORDER_STATUS.READY_FOR_PICK_UP && reservedItems.length > 0 && (
                            <React.Fragment>
                                {(unfulfillableItems.length > 0 || readyForPickUpcanceledItems.length > 0) &&
                                    itemListTitle(getText('readyForPickup'), 'black')}
                                {reservedItems.map((item, index) => (
                                    <div key={item.commerceId}>
                                        {index !== FIRST_ITEM_INDEX && <Divider marginY={4} />}
                                        {productListItem(item, [], false, {
                                            showSubstituteOrPolicy: item.isSubstituted,
                                            forceOutOfStockLabel: true
                                        })}
                                    </div>
                                ))}
                            </React.Fragment>
                        )}
                        {orderStatus === HEADER_LEVEL_ORDER_STATUS.READY_FOR_PICK_UP && readyForPickUpcanceledItems.length > 0 && (
                            <React.Fragment>
                                {itemListTitle(getText('canceledItems'), 'red')}
                                {readyForPickUpcanceledItems.map((item, index) => (
                                    <div key={item.commerceId}>
                                        {index !== FIRST_ITEM_INDEX && <Divider marginY={4} />}
                                        {productListItem(item, [], false, {
                                            showSubstituteOrPolicy: !!item.substituteSku,
                                            forceOutOfStockLabel: true
                                        })}
                                    </div>
                                ))}
                            </React.Fragment>
                        )}
                        {orderStatus === HEADER_LEVEL_ORDER_STATUS.PICKED_UP && fulfilledItems.length > 0 && (
                            <React.Fragment>
                                {itemListTitle(getText('pickedUpItems'), 'black')}
                                {fulfilledItems.map((item, index) => (
                                    <div key={item.commerceId}>
                                        {index !== FIRST_ITEM_INDEX && <Divider marginY={4} />}
                                        {productListItem(item, [], false, {
                                            showSubstituteOrPolicy: item.isSubstituted,
                                            forceOutOfStockLabel: true
                                        })}
                                    </div>
                                ))}
                            </React.Fragment>
                        )}
                        {
                            <React.Fragment>
                                <Divider marginY={[4, null, 5]} />
                                <RopisBasketOrderSummary
                                    isOrderDetail={isOrderDetail}
                                    isCanceledPickupOrder={isCanceledPickupOrder}
                                    priceInfo={priceInfo}
                                    pickupBasket={pickupBasket}
                                    orderStatus={orderStatus}
                                    isBopisOrder={isBopisOrder}
                                    redeemedPoints={redeemedPoints}
                                />
                            </React.Fragment>
                        }
                        {orderStatus === HEADER_LEVEL_ORDER_STATUS.PICKED_UP && pickedUpcanceledItems.length > 0 && (
                            <React.Fragment>
                                {itemListTitle(getText('canceledItems'), 'red')}
                                {pickedUpcanceledItems.map((item, index) => (
                                    <div key={item.commerceId}>
                                        {index !== FIRST_ITEM_INDEX && <Divider marginY={4} />}
                                        {productListItem(item, [], false, {
                                            showSubstituteOrPolicy: !!item.substituteSku,
                                            forceOutOfStockLabel: true
                                        })}
                                    </div>
                                ))}
                                <Divider marginY={4} />
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </div>
        );
    }
}

const styles = {
    header: {
        display: 'none',
        marginTop: space[5],
        [mediaQueries.md]: { display: 'block' }
    },
    noHeader: {
        [mediaQueries.md]: { display: 'none' }
    }
};

export default wrapComponent(OrderItemList, 'OrderItemList');
