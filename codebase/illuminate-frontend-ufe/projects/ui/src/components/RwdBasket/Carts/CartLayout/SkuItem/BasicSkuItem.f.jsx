import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { colors } from 'style/config';
import { Box, Text } from 'components/ui';
import SkuItemLayout from 'components/RwdBasket/Carts/CartLayout/SkuItem/SkuItemLayout';
import ChangeMethodCore from 'components/RwdBasket/Carts/CartLayout/SkuItem/ChangeMethod/ChangeMethodCore';
import skuUtils from 'utils/Sku';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/Carts/CartLayout/locales', 'CartLayout');

function BasicAbovePriceContent({ sku }) {
    return (
        <>
            <Box
                data-at={Sephora.debug.dataAt('sku_size')}
                color={colors.gray}
            >
                {sku.size && (
                    <React.Fragment>
                        {getText('size', [sku.size])}
                        <span
                            data-at={Sephora.debug.dataAt('sku_size_separator')}
                            css={{ margin: '0 .5em' }}
                        >
                            •
                        </span>
                    </React.Fragment>
                )}
                {getText('item', [sku.skuId])}
            </Box>
            {sku.variationType === skuUtils.skuVariationType.COLOR && sku.variationTypeDisplayName && sku.variationValue && (
                <Text
                    display={'block'}
                    fontSize={['xs', 'sm']}
                    marginTop={'2px'}
                    lineHeight={'tight'}
                    data-at={Sephora.debug.dataAt('item_variation_type')}
                >
                    {`${sku.variationTypeDisplayName}: ${sku.variationValue}`}
                </Text>
            )}
        </>
    );
}

function BasicSkuItem({
    item,
    belowPriceContent,
    changeMethodLabel,
    callbacks,
    itemDeliveryMethod,
    preferredStoreInfo,
    preferredZipCode,
    userId,
    hasMetFreeShippingThreshhold,
    isSignedInBIUser,
    isOutOfStock,
    showQuantityPickerBasket
}) {
    return (
        <SkuItemLayout
            item={item}
            showQuantityPickerBasket={showQuantityPickerBasket}
            changeMethodLabel={changeMethodLabel}
            {...callbacks}
            abovePriceContent={<BasicAbovePriceContent sku={item.sku} />}
            belowPriceContent={belowPriceContent}
            isOutOfStock={isOutOfStock}
            rightLGUISection={
                <ChangeMethodCore
                    deferRequests
                    withIcon
                    item={item}
                    onChangeMethod={callbacks.onChangeMethod}
                    handleBopisSkuIsOOSChange={callbacks.handleBopisSkuIsOOSChange}
                    handleSddSkuIsOOSChange={callbacks.handleSddSkuIsOOSChange}
                    itemDeliveryMethod={itemDeliveryMethod}
                    preferredStoreInfo={preferredStoreInfo}
                    preferredZipCode={preferredZipCode}
                    userId={userId}
                />
            }
            itemDeliveryMethod={itemDeliveryMethod}
            preferredStoreInfo={preferredStoreInfo}
            preferredZipCode={preferredZipCode}
            userId={userId}
            hasMetFreeShippingThreshhold={hasMetFreeShippingThreshhold}
            isSignedInBIUser={isSignedInBIUser}
        />
    );
}

export default wrapFunctionalComponent(BasicSkuItem, 'BasicSkuItem');
