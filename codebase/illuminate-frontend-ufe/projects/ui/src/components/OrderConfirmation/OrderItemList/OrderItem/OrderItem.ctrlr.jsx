/* eslint-disable complexity */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Link, Text } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import SizeAndItemNumber from 'components/Product/SizeAndItemNumber/SizeAndItemNumber';
import FinalSaleItem from 'components/SharedComponents/FinalSaleItem';
import bccUtils from 'utils/BCC';
import basketUtils from 'utils/Basket';
import skuUtils from 'utils/Sku';
import userUtils from 'utils/User';
import AddToBasketButton from 'components/AddToBasketButton';
import ProductLove from 'components/Product/ProductLove';
import ProductLoveToggle from 'components/Product/ProductLove/ProductLoveToggle/ProductLoveToggle';
import { itemWidths } from 'components/OrderConfirmation/constants';
import anaConsts from 'analytics/constants';
import { supplementAltTextWithProduct } from 'utils/Accessibility';
import localeUtils from 'utils/LanguageLocale';
import deliveryFrequencyUtils from 'utils/DeliveryFrequency';
import SDURenewalPricing from 'components/SDURenewalPricing';
import SubstituteItem from 'components/ItemSubstitution/SubstituteItem';
import skuHelpers from 'utils/skuHelpers';

const { IMAGE_SIZES } = bccUtils;
const { ADD_TO_BASKET_TYPES: ADD_BUTTON_TYPE } = basketUtils;
const { formatFrequencyType } = deliveryFrequencyUtils;

class OrderItem extends BaseClass {
    render() {
        const getText = localeUtils.getLocaleResourceFile('components/OrderConfirmation/OrderItemList/OrderItem/locales', 'OrderItem');
        const {
            item, loveSource, isPageRenderImg, sduListPrice, isSDUTrial, sduRenewDate, showItemSubstitution
        } = this.props;

        const currentSku = item.sku;
        const isMobile = Sephora.isMobile();
        const isBirthdayGift = skuUtils.isBirthdayGift(currentSku);
        const isWelcomeKit = skuUtils.isWelcomeKit(currentSku);
        const currentProduct = item.product;
        const isReplenishment = item?.isReplenishment;

        const displaySubscriptionInfo = () => {
            const [frequencyType, frequencyNumber] = isReplenishment ? item?.replenishmentFrequency.split(':') : [];
            const enableAutoreplenish = isReplenishment && Sephora.configurationSettings.isAutoReplenishmentEnabled;

            return (
                enableAutoreplenish && (
                    <Box data-at={Sephora.debug.dataAt('confirmation_auto_replenishment_frequency')}>
                        <Text
                            is='p'
                            fontSize='sm'
                            marginTop={3}
                        >
                            {getText('deliveryLabel')}:{' '}
                            <Text
                                is='span'
                                fontWeight='bold'
                            >{`${frequencyNumber} ${formatFrequencyType(frequencyNumber, frequencyType)}`}</Text>
                        </Text>
                    </Box>
                )
            );
        };

        const displayName = (
            <Box lineHeight='base'>
                <Box
                    fontWeight='bold'
                    data-at={Sephora.debug.dataAt('confirmation_item_brand')}
                >
                    {currentSku.brandName}
                </Box>
                {currentSku.productName}
            </Box>
        );

        const getPriceDisplay = price => {
            let outputPrice;

            //Rules based on ACs of ILLUPH-88701
            if (isBirthdayGift) {
                outputPrice = getText('birthdayGift');
            } else if (skuUtils.isFree(currentSku)) {
                outputPrice = getText('free');
            } else if (isWelcomeKit) {
                outputPrice = getText('welcomeKit');

                if (userUtils.isRouge()) {
                    outputPrice = `${getText('rouge')} ${outputPrice}`;
                }
            } else {
                outputPrice = price.replace(' ', '&nbsp;');
            }

            return outputPrice;
        };

        const setupAmountMarkup = amount => {
            let outputAmount;

            if (isBirthdayGift || isWelcomeKit) {
                outputAmount = amount;
            } else if (skuUtils.isFree(currentSku)) {
                outputAmount = getText('free');
            } else if (currentSku.type === 'SDU') {
                outputAmount = isSDUTrial ? `${getText('free')}*` : `${sduListPrice}*`;
            } else {
                outputAmount = amount.replace(' ', '&nbsp;');
            }

            return (
                <b
                    data-at={Sephora.debug.dataAt('confirmation_item_amount')}
                    dangerouslySetInnerHTML={{ __html: outputAmount }}
                />
            );
        };

        const orderFullSize = () => {
            if (currentSku.fullSizeSku && (skuUtils.isBiReward(currentSku) || skuUtils.isSample(currentSku))) {
                return (
                    <Box marginTop={3}>
                        <AddToBasketButton
                            productId={item.product.productId}
                            sku={currentSku.fullSizeSku}
                            productName={currentProduct.displayName}
                            listPrice={currentSku.listPrice}
                            skuType={currentSku.type}
                            variant={ADD_BUTTON_TYPE.SECONDARY}
                            analyticsContext={anaConsts.CONTEXT.ORDER_CONFIRMATION}
                            disabled={skuHelpers.isInBasket(currentSku.fullSizeSku.skuId)}
                            text={getText('orderFullSizeButton')}
                            style={{ whiteSpace: 'nowrap' }}
                        />
                    </Box>
                );
            } else {
                return null;
            }
        };

        const imageProps = {
            id: currentSku.skuId,
            skuImages: currentSku.skuImages,
            disableLazyLoad: true,
            altText: supplementAltTextWithProduct(currentSku, currentProduct)
        };
        //[GUAR-3910] Price on Order Confirmation page is displayed with 5% discount on AR orders instead of 15%.
        //So replenishmentItemPrice is replacing replenishmentAdjusterPrice for AR orders.
        const currentPriceValue = isReplenishment ? item.replenishmentItemPrice : getPriceDisplay(currentSku.salePrice || currentSku.listPrice);

        return (
            <div>
                <LegacyGrid
                    gutter={isMobile ? 4 : 6}
                    lineHeight='tight'
                >
                    <LegacyGrid.Cell width={isMobile ? 'fill' : itemWidths.DESC}>
                        <LegacyGrid gutter={4}>
                            <LegacyGrid.Cell width='fit'>
                                <Box href={!isBirthdayGift && !isWelcomeKit && currentSku.targetUrl}>
                                    <ProductImage
                                        isPageRenderImg={isPageRenderImg}
                                        id={currentSku.skuId}
                                        size={IMAGE_SIZES[97]}
                                        skuImages={currentSku.skuImages}
                                        altText={supplementAltTextWithProduct(currentSku, currentProduct)}
                                    />
                                </Box>
                            </LegacyGrid.Cell>
                            <LegacyGrid.Cell width='fill'>
                                {currentSku.targetUrl ? <Link href={currentSku.targetUrl}>{displayName}</Link> : displayName}
                                <Box
                                    marginTop={1}
                                    lineHeight='tight'
                                >
                                    {currentSku.type !== 'SDU' && (
                                        <SizeAndItemNumber
                                            sku={currentSku}
                                            fontSize={isMobile ? 'xs' : 'sm'}
                                            data-at={Sephora.debug.dataAt('confirmation_item_sku')}
                                        />
                                    )}
                                    {currentSku.type === 'SDU' && (
                                        <SDURenewalPricing
                                            hasUserSDUTrial={isSDUTrial}
                                            SDUFormattedDate={sduRenewDate}
                                            sduListPrice={sduListPrice}
                                        />
                                    )}
                                    <ProductVariation
                                        fontSize={isMobile ? 'xs' : 'sm'}
                                        marginTop={1}
                                        data-at={Sephora.debug.dataAt('confirmation_item_description')}
                                        {...skuUtils.getProductVariations({ sku: currentSku })}
                                    />
                                    {displaySubscriptionInfo()}
                                </Box>
                                {isMobile && (
                                    <Box marginTop={3}>
                                        <b data-at={Sephora.debug.dataAt('confirmation_item_qty')}>
                                            {getText('qty')}: {item.qty}
                                        </b>
                                    </Box>
                                )}
                                <FinalSaleItem isReturnable={currentSku.isReturnable} />
                            </LegacyGrid.Cell>
                        </LegacyGrid>
                        {showItemSubstitution && !isMobile && <SubstituteItem item={item.substituteSku} />}
                    </LegacyGrid.Cell>
                    <LegacyGrid.Cell
                        width={isMobile ? 'fit' : itemWidths.AMOUNT}
                        textAlign='right'
                        css={!isMobile ? { order: 1 } : null}
                    >
                        {setupAmountMarkup(item.itemTotal)}
                        {currentSku.actionFlags &&
                            !skuUtils.isSample(currentSku) &&
                            !skuUtils.isBiReward(currentSku) &&
                            currentSku.actionFlags.myListStatus !== 'notApplicable' &&
                            currentSku.type !== 'SDU' && (
                            <Box marginTop={2}>
                                <ProductLove
                                    sku={currentSku}
                                    loveSource={loveSource}
                                    productId={currentProduct?.productId}
                                    imageProps={imageProps}
                                >
                                    <ProductLoveToggle
                                        size={20}
                                        width={30}
                                        height={30}
                                        productId={currentProduct?.productId}
                                    />
                                </ProductLove>
                            </Box>
                        )}
                        {isMobile || orderFullSize()}
                    </LegacyGrid.Cell>
                    {isMobile || (
                        <LegacyGrid.Cell
                            width={itemWidths.PRICE}
                            data-at={Sephora.debug.dataAt('confirmation_item_price')}
                            fontWeight='bold'
                            dangerouslySetInnerHTML={{
                                __html: currentSku.type === 'SDU' ? (isSDUTrial ? `${getText('free')}*` : `${sduListPrice}*`) : currentPriceValue
                            }}
                        />
                    )}
                    {isMobile || (
                        <LegacyGrid.Cell
                            width={itemWidths.QTY}
                            data-at={Sephora.debug.dataAt('confirmation_item_qty')}
                        >
                            {item.qty}
                        </LegacyGrid.Cell>
                    )}
                </LegacyGrid>
                {showItemSubstitution && isMobile && <SubstituteItem item={item.substituteSku} />}
            </div>
        );
    }
}

export default wrapComponent(OrderItem, 'OrderItem');
