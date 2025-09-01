import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box } from 'components/ui';
import CartLayout from 'components/RwdBasket/Carts/CartLayout/CartLayout';
import BOPISHeader from 'components/RwdBasket/RwdPreBasket/CartHeaders/BOPIS/BOPISHeader';
import BasicSkuItem from 'components/RwdBasket/Carts/CartLayout/SkuItem/BasicSkuItem';
import GwpSkuItem from 'components/RwdBasket/Carts/CartLayout/SkuItem/GwpSkuItem';
import ConfirmationBox from 'components/RwdBasket/Carts/CartLayout/ConfirmationBox/ConfirmationBox';
import RewardSkuItem from 'components/RwdBasket/Carts/CartLayout/SkuItem/RewardSkuItem';
import compConstants from 'components/constants';
import localeUtils from 'utils/LanguageLocale';
import skuUtils from 'utils/Sku';
import getCallbacks from 'components/RwdBasket/Carts/CartLayout/SkuItem/Buttons/getCallbacks';
import BasketBindings from 'analytics/bindingMethods/pages/basket/BasketBindings';

const allCallbacks = getCallbacks({ isBopis: true });
const { getLocaleResourceFile } = localeUtils;

class BOPISCart extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            outOfStockMap: {}
        };
    }

    componentDidMount() {
        this.props.errors.bopisRewardErrors.forEach(error => {
            BasketBindings.triggerRewardErrorAnalytics(this.props.items, error);
        });
    }

    handleBopisSkuIsOOSChange = (skuId, isOOS) => {
        this.setState({
            outOfStockMap: {
                ...this.state.outOfStockMap,
                [skuId]: isOOS
            }
        });
    };

    BOPISSkuItem = ({
        item,
        changeMethodLabel,
        callbacks,
        itemDeliveryMethod,
        preferredZipCode,
        storeDetails,
        userId,
        hasMetFreeShippingThreshhold,
        isSignedInBIUser,
        isOutOfStock,
        showQuantityPickerBasket
    }) => {
        return (
            <BasicSkuItem
                showQuantityPickerBasket={showQuantityPickerBasket}
                item={item}
                changeMethodLabel={changeMethodLabel}
                isOutOfStock={isOutOfStock}
                callbacks={{
                    ...callbacks,
                    handleBopisSkuIsOOSChange: this.handleBopisSkuIsOOSChange
                }}
                itemDeliveryMethod={itemDeliveryMethod}
                preferredStoreInfo={storeDetails}
                preferredZipCode={preferredZipCode}
                userId={userId}
                hasMetFreeShippingThreshhold={hasMetFreeShippingThreshhold}
                isSignedInBIUser={isSignedInBIUser}
            />
        );
    };

    skuComponentMapper = mapperProps => {
        const {
            getText,
            items,
            hasPickupStoreReservationOnHoldError,
            itemDeliveryMethod,
            preferredZipCode,
            storeDetails,
            userId,
            hasMetFreeShippingThreshhold,
            isSignedIn,
            isSignedInBIUser,
            itemErrorMap,
            isOmniRewardEnabled,
            showQuantityPickerBasket
        } = mapperProps;

        return items.map((item, index) => {
            item.error = itemErrorMap.get(item.commerceId);
            item.enablePageRenderTracking = index < compConstants.PAGE_RENDER_TRACKING_LIMIT;

            const props = {
                key: item.sku.skuId,
                item: item,
                changeMethodLabel: getText('changeMethod'),
                callbacks: {
                    ...allCallbacks,
                    handleBopisSkuIsOOSChange: this.handleBopisSkuIsOOSChange
                },
                hasPickupStoreReservationOnHoldError,
                itemDeliveryMethod,
                preferredZipCode,
                storeDetails,
                userId,
                hasMetFreeShippingThreshhold,
                isSignedIn,
                isSignedInBIUser,
                isOutOfStock: this.state.outOfStockMap[item.sku.skuId],
                isOmniRewardEnabled,
                showQuantityPickerBasket
            };

            if (skuUtils.isGwp(item.sku)) {
                return <GwpSkuItem {...props} />;
            }

            if (skuUtils.isBiReward(item.sku)) {
                return <RewardSkuItem {...props} />;
            }

            if (skuUtils.isStandardProduct(item.sku)) {
                return this.BOPISSkuItem(props);
            }

            throw new Error(`Shipping and Delivery sku mapper received sku of type: ${item.sku.type}`);
        });
    };

    showHeadlineError = () => {
        return Object.values(this.state.outOfStockMap).some(bool => bool);
    };

    render() {
        const {
            items,
            pickupMessage,
            pickupOrderNotificationMsg,
            totalQuantity,
            hasPickupStoreReservationOnHoldError,
            itemDeliveryMethod,
            preferredZipCode,
            storeDetails,
            userId,
            errors,
            itemErrorMap,
            confirmationBoxInfo,
            isSignedInBIUser,
            infoModalCallbacks,
            hasMetFreeShippingThreshhold,
            isOmniRewardEnabled,
            showBasketGreyBackground,
            backgroundColor,
            showQuantityPickerBasket
        } = this.props;

        const getText = getLocaleResourceFile('components/RwdBasket/Carts/BOPISCart/locales', 'BOPISCart');
        const shouldShowError = this.showHeadlineError();

        return (
            <CartLayout
                {...(showBasketGreyBackground && { backgroundColor: backgroundColor })}
                title={getText('bopisTitle', [totalQuantity])}
                infoModalCallbacks={infoModalCallbacks}
                iconName={shouldShowError ? 'alert' : 'store'}
                iconColor={shouldShowError ? 'red' : null}
                confirmationBox={
                    <ConfirmationBox
                        {...confirmationBoxInfo}
                        onUndoChangeMethod={allCallbacks.onUndoChangeMethod}
                        itemDeliveryMethod={itemDeliveryMethod}
                    />
                }
                skuItemComponents={this.skuComponentMapper({
                    getText,
                    items,
                    hasPickupStoreReservationOnHoldError,
                    itemDeliveryMethod,
                    preferredZipCode,
                    storeDetails,
                    userId,
                    itemErrorMap,
                    isSignedInBIUser,
                    hasMetFreeShippingThreshhold,
                    oosMap: this.state.outOfStockMap,
                    isOmniRewardEnabled,
                    showQuantityPickerBasket
                })}
                errors={errors}
                textZone={pickupOrderNotificationMsg}
                subHeader={
                    <Box
                        paddingLeft={[0, '36px']}
                        marginTop={[2, '6px']}
                    >
                        <BOPISHeader
                            pickupMessage={pickupMessage}
                            storeDetails={storeDetails}
                            showDetailsLink={true}
                        />
                    </Box>
                }
            />
        );
    }
}

export default wrapComponent(BOPISCart, 'BOPISCart', true);
