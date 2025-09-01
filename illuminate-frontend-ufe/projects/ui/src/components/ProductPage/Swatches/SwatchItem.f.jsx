import store from 'Store';
import productPageSOTBindings from 'analytics/bindingMethods/pages/productPage/productPageSOTBindings';
import anaConsts from 'analytics/constants';
import Flag from 'components/Flag/Flag';
import SwatchButton from 'components/ProductPage/Swatches/SwatchButton';
import SwatchChiclet from 'components/ProductPage/Swatches/SwatchChiclet';
import SwatchImage from 'components/ProductPage/Swatches/SwatchImage';
import { Box, Grid, Text } from 'components/ui';
import React from 'react';
import { colors } from 'style/config';
import Debounce from 'utils/Debounce';
import filterUtils from 'utils/Filters';
import marketingFlagsUtil from 'utils/MarketingFlags';
import skuUtils from 'utils/Sku';
import swatchUtils from 'utils/Swatch';
import userUtils from 'utils/User';
import { wrapFunctionalComponent } from 'utils/framework';
import UtilActions from 'utils/redux/Actions';
const DEBOUNCE_HOVER = 50;
const { SWATCH_GROUP_VIEWS } = swatchUtils;
import helpersUtils from 'utils/Helpers';
const { deferTaskExecution } = helpersUtils;
import processEvent from 'analytics/processEvent';

const handleSkuOnMouseEnter = sku => {
    if (!Sephora.isTouch) {
        store.dispatch(UtilActions.merge('page.product', 'hoveredSku', sku));
    }
};

const handleSkuOnMouseLeave = () => {
    if (!Sephora.isTouch) {
        store.dispatch(UtilActions.merge('page.product', 'hoveredSku', null));
    }
};

const triggerAnalytics = params => {
    const {
        skuId,
        quantity,
        isOnlineOnly,
        listPrice,
        isSameDayEligibleSku,
        productId,
        storeId,
        topCategory,
        brandName,
        isOutOfStock,
        basketType,
        productName
    } = params;

    const shippingMethod = basketType ? basketType : anaConsts.DELIVERY_OPTIONS_MAP.Standard;
    const customerZipCode = userUtils.getZipCode();

    productPageSOTBindings.swatchChange({
        skuId,
        quantity,
        isOnlineOnly,
        listPrice,
        isSameDayEligibleSku,
        productId,
        storeId,
        topCategory,
        brandName,
        isOutOfStock,
        basketType,
        shippingMethod,
        customerZipCode
    });

    deferTaskExecution(() => {
        // Dispatches the Select Item Event
        processEvent.process(anaConsts.SELECT_ITEM_EVENT, {
            data: {
                listName: skuId || '',
                listId: skuId || '',
                productId: skuId || '',
                price: listPrice || '',
                brandName: brandName || '',
                productName: productName || '',
                productIndex: 0
            }
        });
    });
};

const handleSwatchSelection = (sku, props, isCustomSet, swatchItemCallback) => {
    const {
        skuId, isSameDayEligibleSku, isOutOfStock, isOnlineOnly, listPrice, productName
    } = sku;
    const {
        currentProduct: {
            productDetails: {
                productId,
                brand: { displayName: brandName }
            },
            parentCategory: { categoryId, displayName }
        },
        basketType,
        quantity,
        storeId,
        isItemSubModal,
        onSwatchSelect
    } = props;

    if (isItemSubModal) {
        onSwatchSelect(sku);
    } else if (isCustomSet) {
        swatchItemCallback(sku);
    } else {
        const { handleSkuOnClick, updateDigitalDataProduct } = swatchUtils;
        handleSkuOnClick(sku);
        updateDigitalDataProduct(props);
        swatchItemCallback(sku);
    }

    triggerAnalytics({
        skuId,
        quantity,
        isOnlineOnly,
        listPrice,
        isSameDayEligibleSku,
        productId,
        storeId,
        topCategory: { categoryId, displayName },
        brandName,
        isOutOfStock,
        basketType,
        productName
    });
};

const handleSkuOnMouseAction = Debounce.debounce((type, sku, isCustomSet, isItemSubModal) => {
    if (!isCustomSet && !isItemSubModal) {
        switch (type) {
            case 'enter':
                handleSkuOnMouseEnter(sku);

                break;
            case 'leave':
                handleSkuOnMouseLeave();

                break;
            default:
                break;
        }
    }
}, DEBOUNCE_HOVER);

/* eslint-disable-next-line complexity */
const SwatchItem = props => {
    const { isActiveSwatch, handleKeyDown, NO_MATCH } = swatchUtils;
    const isActive = props.isSkuReady && isActiveSwatch(props);
    const {
        currentProduct = {},
        sku,
        index,
        matchText,
        isShadeFinderActive,
        isCustomSet,
        swatchItemCallback,
        selectedItemRef,
        customSetDataAt,
        swatchView = SWATCH_GROUP_VIEWS.GRID,
        swatchTypeStyle,
        isFragrance,
        listPadding,
        isDropdown,
        colorIQMatch,
        isItemSubModal
    } = props;

    const { skuSelectorType } = currentProduct;

    let match;

    if (isShadeFinderActive) {
        match = sku.skuId === isShadeFinderActive.skuId;
    } else if (!isShadeFinderActive && matchText && matchText.toLowerCase() === NO_MATCH) {
        match = false;
    } else {
        match = colorIQMatch?.skuId === sku.skuId;
    }

    const isImageType = !isFragrance && (isCustomSet || skuSelectorType === skuUtils.skuSwatchType.IMAGE);

    const newSku =
        matchText && matchText.toLowerCase() !== NO_MATCH
            ? {
                ...sku,
                match: 'match'
            }
            : sku;
    const flags = marketingFlagsUtil.getShadeFilterFlags(swatchView === SWATCH_GROUP_VIEWS.LIST ? sku : newSku);

    const sharedButtonProps = {
        ref: isActive ? selectedItemRef : null,
        onClick: () => handleSwatchSelection(sku, props, isCustomSet, swatchItemCallback),
        onMouseEnter: () => handleSkuOnMouseAction('enter', sku, isCustomSet, isItemSubModal),
        onMouseLeave: () => handleSkuOnMouseAction('leave', sku, isCustomSet, isItemSubModal),
        onFocus: () => handleSkuOnMouseAction('enter', sku, isCustomSet, isItemSubModal),
        onBlur: () => handleSkuOnMouseAction('leave', sku, isCustomSet, isItemSubModal),
        onKeyDown: e => handleKeyDown(e, index),
        ['data-at']: Sephora.debug.dataAt(customSetDataAt || isActive ? 'selected_swatch' : 'swatch'),
        ['aria-selected']: isActive,
        ['aria-live']: 'polite',
        ['aria-atomic']: true,
        ['aria-label']: [
            sku.isOutOfStock && !sku.isComingSoonTreatment ? 'Out of stock: ' : null,
            sku.isComingSoonTreatment ? 'Coming soon: ' : null,
            sku.variationValue,
            sku.variationDesc ? ' ' + sku.variationDesc : null,
            isActive ? ' - Selected' : null
        ].join('')
    };

    const swatchProps = {
        isOutOfStock: sku.isOutOfStock,
        isOnSale: sku.salePrice,
        isNew: sku.isNew,
        isMatch: match
    };

    const swatchImageProps = {
        src: sku.smallImage,
        type: swatchTypeStyle
    };

    return swatchView === SWATCH_GROUP_VIEWS.LIST ? (
        <Box
            {...sharedButtonProps}
            is='div'
            display='flex'
            alignItems='center'
            paddingY={1}
            paddingX={listPadding}
            css={{
                outline: 0,
                scrollSnapAlign: 'start',
                transition: 'background-color .2s',
                '.no-touch &:hover, :focus': { backgroundColor: colors.nearWhite }
            }}
        >
            <SwatchImage
                {...swatchProps}
                {...swatchImageProps}
                hasOutline={true}
                isActive={isActive}
                marginRight={isDropdown ? 4 : 1}
                marginLeft={`-${swatchUtils.SWATCH_BORDER}px`}
                flexShrink={0}
                data-at={isActive ? Sephora.debug.dataAt('color_swatch_selected') : Sephora.debug.dataAt('color_swatch_option')}
            />
            <div data-at={Sephora.debug.dataAt('color_swatch_name')}>
                {filterUtils.getDescription(sku)}{' '}
                {flags.map(({ text, backgroundColor }) => (
                    <Flag
                        key={text}
                        children={text}
                        backgroundColor={backgroundColor}
                        marginRight={1}
                    />
                ))}
            </div>
        </Box>
    ) : (
        <SwatchButton
            {...sharedButtonProps}
            type={swatchTypeStyle}
            isActive={isActive}
            isImage={isImageType}
        >
            {isImageType && (
                <SwatchImage
                    {...swatchProps}
                    {...swatchImageProps}
                    data-at={customSetDataAt ? Sephora.debug.dataAt(`${customSetDataAt}_img`) : null}
                />
            )}

            {isImageType || (
                <>
                    <SwatchChiclet
                        isActive={isActive}
                        {...swatchProps}
                        {...(isFragrance && {
                            width: [198, null, '100%'],
                            height: null,
                            paddingY: 1,
                            paddingX: 2
                        })}
                    >
                        {isFragrance ? (
                            <Grid
                                gap={2}
                                columns='auto 1fr'
                                alignItems='center'
                            >
                                <SwatchImage {...swatchImageProps} />
                                <Text
                                    fontSize='xs'
                                    lineHeight='tight'
                                    numberOfLines={3}
                                    css={{
                                        flex: 1,
                                        textTransform: 'uppercase'
                                    }}
                                    children={sku.variationValue}
                                />
                            </Grid>
                        ) : skuSelectorType === skuUtils.skuSwatchType.TEXT ? (
                            sku.swatchText
                        ) : (
                            sku.size
                        )}
                    </SwatchChiclet>
                </>
            )}
        </SwatchButton>
    );
};

SwatchItem.shouldUpdatePropsOn = ['sku', 'currentProduct.currentSku', 'isShadeFinderActive', 'colorIQMatch'];

export default wrapFunctionalComponent(SwatchItem, 'SwatchItem');
