import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { Box } from 'components/ui';
import CartLayout from 'components/RwdBasket/Carts/CartLayout/CartLayout';
import SDDDeliveryInfo from 'components/RwdBasket/DeliveryInfo/SDD/SDDDeliveryInfo';
import TextZone from 'components/RwdBasket/Carts/SDDCart/TextZone/TextZone';
import SDUSkuItem from 'components/RwdBasket/Carts/SDDCart/SkuItem/SDUSkuItem';
import SDDSkuItem from 'components/RwdBasket/Carts/SDDCart/SkuItem/SDDSkuItem';
import ConfirmationBox from 'components/RwdBasket/Carts/CartLayout/ConfirmationBox/ConfirmationBox';
import RewardSkuItem from 'components/RwdBasket/Carts/CartLayout/SkuItem/RewardSkuItem';

import localeUtils from 'utils/LanguageLocale';
import addressUtils from 'utils/Address';
import skuUtils from 'utils/Sku';

import getCallbacks from 'components/RwdBasket/Carts/CartLayout/SkuItem/Buttons/getCallbacks';
import compConstants from 'components/constants';

const { formatZipCode } = addressUtils;
const { getLocaleResourceFile } = localeUtils;
const allCallbacks = getCallbacks({ isBopis: false });
import BasketBindings from 'analytics/bindingMethods/pages/basket/BasketBindings';

class SDDCart extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            outOfStockMap: {}
        };
    }

    componentDidMount() {
        this.props.errors.sameDayRewardErrors.forEach(error => {
            BasketBindings.triggerRewardErrorAnalytics(this.props.items, error);
        });
    }

    handleSddSkuIsOOSChange = (skuId, isOOS) => {
        this.setState({
            outOfStockMap: {
                ...this.state.outOfStockMap,
                [skuId]: isOOS
            }
        });
    };

    skuComponentMapper = (getText, itemErrorMap) => {
        const {
            items,
            isUserSDUTrialEligible,
            itemDeliveryMethod,
            preferredStoreInfo,
            preferredZipCode,
            userId,
            hasMetFreeShippingThreshhold,
            isSignedIn,
            isSignedInBIUser,
            sameDayIsAvailable,
            isOmniRewardEnabled,
            showQuantityPickerBasket
        } = this.props;

        return items.map((item, index) => {
            item.error = itemErrorMap.get(item.commerceId);
            item.enablePageRenderTracking = index < compConstants.PAGE_RENDER_TRACKING_LIMIT;

            const props = {
                key: item.sku.skuId,
                item: item,
                changeMethodLabel: getText('changeMethod'),
                callbacks: {
                    ...allCallbacks,
                    handleSddSkuIsOOSChange: this.handleSddSkuIsOOSChange
                },
                itemDeliveryMethod,
                preferredStoreInfo,
                preferredZipCode,
                userId,
                hasMetFreeShippingThreshhold,
                isSignedIn,
                isSignedInBIUser,
                sameDayIsAvailable,
                isOutOfStock: this.state.outOfStockMap[item.sku.skuId],
                isOmniRewardEnabled,
                showQuantityPickerBasket
            };

            if (skuUtils.isSDU(item.sku)) {
                return (
                    <SDUSkuItem
                        isUserSDUTrialEligible={isUserSDUTrialEligible}
                        getText={getText}
                        {...props}
                    />
                );
            }

            if (skuUtils.isBiReward(item.sku)) {
                return <RewardSkuItem {...props} />;
            }

            if (skuUtils.isStandardProduct(item.sku)) {
                return <SDDSkuItem {...props} />;
            }

            throw new Error(`SDDCart sku mapper received sku of type: ${item.sku.type}`);
        });
    };

    showHeadlineError = () => {
        const { sameDayIsAvailable } = this.props;
        const oosItemExists = Object.values(this.state.outOfStockMap).some(bool => bool);
        // Check if reducer default null has changed to a boolean from user or zip call
        const zipCodeEligibilityDetermined = typeof sameDayIsAvailable === 'boolean';

        if (zipCodeEligibilityDetermined) {
            return oosItemExists || !sameDayIsAvailable;
        }

        return oosItemExists;
    };

    render() {
        const {
            items,
            totalQuantity,
            sameDayTitle,
            sameDayDeliveryMessage,
            isUserSDUTrialEligible,
            preferredZipCode,
            itemDeliveryMethod,
            errors,
            itemErrorMap,
            confirmationBoxInfo,
            infoModalCallbacks,
            sameDayIsAvailable,
            showBasketGreyBackground,
            backgroundColor,
            ...props
        } = this.props;

        const getText = getLocaleResourceFile('components/RwdBasket/Carts/SDDCart/locales', 'SDDCart');
        const sddTitle = sameDayTitle || getText('sameDayDelivery');
        const isServiceUnavailable = itemErrorMap.has('serviceUnavailable');

        const subHeader = !isServiceUnavailable && (
            <Box
                paddingLeft={'36px'}
                marginTop={['2px', 1]}
            >
                <SDDDeliveryInfo
                    zipCode={formatZipCode(preferredZipCode)}
                    message={sameDayDeliveryMessage}
                    isSduAvailable={errors?.isAvailable}
                    sameDayIsAvailable={sameDayIsAvailable}
                />
            </Box>
        );

        return (
            <CartLayout
                {...(showBasketGreyBackground && { backgroundColor: backgroundColor })}
                cartType='sameday'
                title={`${sddTitle} (${totalQuantity})`}
                infoModalCallbacks={infoModalCallbacks}
                iconName={this.showHeadlineError() ? 'alert' : 'bag'}
                iconColor={this.showHeadlineError() ? 'red' : null}
                confirmationBox={
                    <ConfirmationBox
                        {...confirmationBoxInfo}
                        onUndoChangeMethod={allCallbacks.onUndoChangeMethod}
                        itemDeliveryMethod={itemDeliveryMethod}
                    />
                }
                skuItemComponents={this.skuComponentMapper(getText, itemErrorMap)}
                subHeader={subHeader}
                errors={errors}
                itemErrorMap={itemErrorMap}
                textZone={
                    <TextZone
                        isUserSDUTrialEligible={isUserSDUTrialEligible}
                        {...props}
                    />
                }
            />
        );
    }
}

export default wrapComponent(SDDCart, 'SDDCart', true);
