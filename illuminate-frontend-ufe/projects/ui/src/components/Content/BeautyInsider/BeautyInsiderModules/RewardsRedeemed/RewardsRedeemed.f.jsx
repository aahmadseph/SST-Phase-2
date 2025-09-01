/* eslint-disable complexity */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { forms } from 'style/config';
import {
    Box, Image, Text, Button, Grid, Flex, Divider, Link
} from 'components/ui';
import urlUtils from 'utils/Url';
import BeautyInsiderModuleLayout from 'components/Content/BeautyInsider/BeautyInsiderModuleLayout/BeautyInsiderModuleLayout';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductDisplayName from 'components/Product/ProductDisplayName/ProductDisplayName';
import SizeAndItemNumber from 'components/Product/SizeAndItemNumber/SizeAndItemNumber';
import skuUtils from 'utils/Sku';
import mediaUtils from 'utils/Media';
import localeUtils from 'utils/LanguageLocale';
import analyticsUtils from 'analytics/utils';
import basketUtils from 'utils/Basket';
import skuHelpers from 'utils/skuHelpers';
const SKU_BI_TYPE_BIRTHDAY = 'Birthday Gift';

const getText = localeUtils.getLocaleResourceFile('components/Content/BeautyInsider/BeautyInsiderModules/RewardsRedeemed/locales', 'RewardsRedeemed');
const { Media } = mediaUtils;
const { ADD_BUTTON_TYPE } = basketUtils.ADD_TO_BASKET_TYPES;

function renderItemActions(sku, hasParentLink) {
    const isRecentRewardItemList = true;
    const isSubscription = skuUtils.isSubscription(sku);

    let productListItemButton;
    const ctaText = {
        shopTheBrand: getText('shopTheBrand'),
        viewFullSize: getText('viewFullSize')
    };

    if (!sku.isActive) {
        productListItemButton = (
            <Text
                is='p'
                data-at={Sephora.debug.dataAt('item_is_no_longer_available')}
                height={forms.HEIGHT}
                display='flex'
                justifyContent='center'
                textAlign='center'
                alignItems='center'
                color='gray'
            >
                {getText('itemIsNoLongerAvailable')}
            </Text>
        );
    } else if (skuUtils.isCountryRestricted(sku)) {
        productListItemButton = (
            <Text
                is='p'
                data-at={Sephora.debug.dataAt('item_cannot_be_shipped')}
                height={forms.HEIGHT}
                display='flex'
                justifyContent='center'
                textAlign='center'
                alignItems='center'
                color='gray'
            >
                {getText(localeUtils.isCanada() ? 'itemShipToCanada' : 'itemShipToUS')}
            </Text>
        );
    } else if (!sku.isOutOfStock && skuUtils.isBiExclusive(sku) && !skuHelpers.isBiQualify(sku)) {
        productListItemButton = (
            <Button
                variant='secondary'
                block={true}
                href={hasParentLink ? null : sku.targetUrl}
            >
                {getText('viewDetails')}
            </Button>
        );
    } else if (skuUtils.isBiRewardGwpSample(sku)) {
        const isFullSizeOrderable = sku.actionFlags && sku.actionFlags.isFullSizeSkuOrderable;
        const buttonText = isFullSizeOrderable ? ctaText.viewFullSize : isRecentRewardItemList && sku.brandId ? ctaText.shopTheBrand : null;
        const href = buttonText === ctaText.shopTheBrand ? sku.seoBrandUrl || null : sku.fullSizeSku ? sku.fullSizeSku.targetUrl : sku.targetUrl;
        const analyticsCTAText =
            buttonText === ctaText.shopTheBrand ? getText('shopTheBrand') : buttonText === ctaText.viewFullSize ? getText('viewFullSize') : '';

        const ctaTrackingData = ['', sku.productId, analyticsCTAText].join(':');

        productListItemButton = (
            <Button
                variant='secondary'
                style={buttonText && href ? null : { visibility: 'hidden' }}
                block={true}
                onClick={e => {
                    analyticsUtils.setNextPageDataAndRedirect(e, {
                        trackingData: {
                            linkData: ctaTrackingData,
                            internalCampaign: ctaTrackingData
                        },
                        destination: href
                    });
                }}
            >
                {buttonText}
            </Button>
        );
    } else {
        productListItemButton = (
            <React.Fragment>
                <AddToBasketButton
                    block={true}
                    sku={sku}
                    variant={ADD_BUTTON_TYPE.SPECIAL}
                />
            </React.Fragment>
        );
    }

    return (
        <Box
            width={145}
            marginTop={[3, 0]}
            style={isSubscription ? { visibility: 'hidden' } : null}
        >
            {productListItemButton}
        </Box>
    );
}

function renderPrice(sku) {
    return (
        <Box fontWeight='bold'>
            <span
                data-at={Sephora.debug.dataAt('sku_item_price_list')}
                dangerouslySetInnerHTML={{
                    __html: skuUtils.isBirthdayGift(sku) ? SKU_BI_TYPE_BIRTHDAY : sku.listPrice.replace(' ', '&nbsp;')
                }}
            />
        </Box>
    );
}

const renderProductImage = sku => {
    return (
        <ProductImage
            disableLazyLoad={true}
            id={sku.skuId}
            size={[60, 100]}
            skuImages={sku.skuImages}
        />
    );
};

const renderProductDetails = (sku, isSmui) => {
    const isSampleSkuWithoutFullSize = skuUtils.isSample(sku) && !sku.actionFlags.isFullSizeSkuOrderable;
    const isSDU = skuUtils.isSDU(sku);

    return (
        <Box>
            <ProductDisplayName
                fontSize='base'
                brandName={isSampleSkuWithoutFullSize ? sku.variationValue : sku.brandName}
                productName={isSampleSkuWithoutFullSize ? null : sku.productName}
            />
            {isSmui && renderPrice(sku)}
            {!isSDU && (
                <SizeAndItemNumber
                    sku={sku}
                    fontSize='sm'
                    marginTop={1}
                />
            )}
            <Text
                is='p'
                marginTop={1}
                fontSize='sm'
                color='gray'
                children={getText('redeemedOn', [sku.readableTransactionDate])}
            />
        </Box>
    );
};

const renderItemLGUI = (sku, isLastItem) => {
    return (
        <>
            <Flex
                flexDirection='row'
                flexWrap='wrap'
                justifyContent='space-between'
            >
                <Grid
                    columns='auto 1fr'
                    flexBasis='48%'
                >
                    {renderProductImage(sku)}
                    {renderProductDetails(sku)}
                </Grid>
                <Box>{renderPrice(sku)}</Box>
                <Box>{renderItemActions(sku)}</Box>
            </Flex>
            {!isLastItem && (
                <Divider
                    marginTop={4}
                    marginBottom={4}
                />
            )}
        </>
    );
};

const renderItemSMUI = (sku, isLastItem) => {
    return (
        <>
            <Grid
                columns='auto 1fr'
                gap='20px'
            >
                {renderProductImage(sku)}
                <Box>
                    {renderProductDetails(sku, true)}
                    {renderItemActions(sku)}
                </Box>
            </Grid>
            {!isLastItem && (
                <Divider
                    marginTop={3}
                    marginBottom={3}
                />
            )}
        </>
    );
};

const contentZone = (content = []) => {
    if (content.length > 0) {
        return (
            <>
                <Divider marginBottom={[4, 5]} />
                <Media greaterThan='sm'>
                    {content.slice(0, 3).map((item, index) => {
                        const isLastItem = index + 1 === content.slice(0, 3).length;

                        return renderItemLGUI(item, isLastItem);
                    })}
                </Media>
                <Media lessThan='md'>
                    {content.slice(0, 3).map((item, index) => {
                        const isLastItem = index + 1 === content.slice(0, 3).length;

                        return renderItemSMUI(item, isLastItem);
                    })}
                </Media>
            </>
        );
    } else {
        return (
            <>
                <Image
                    display='block'
                    size={[48, 120]}
                    marginBottom={3}
                    src='/img/ufe/no-redeemed.svg'
                />
                <Text
                    is='p'
                    marginBottom={3}
                    children={getText('noRewardsYet')}
                />
                <Button
                    variant='secondary'
                    hasMinWidth={true}
                    onClick={() => {
                        urlUtils.redirectTo('/rewards');
                    }}
                    name='applyBtn'
                    marginBottom={[4, 0]}
                    children={getText('browseLinkText')}
                    width={['100%', 'auto']}
                />
            </>
        );
    }
};

const RewardsRedeemed = props => {
    const headerCtaTitle = () => {
        if (props.content?.length > 3) {
            return (
                <Link
                    href='/purchase-history?filterby=rewards'
                    data-at={Sephora.debug.dataAt('rr_view_all_btn')}
                    children={getText('viewAll')}
                    color='blue'
                />
            );
        } else {
            return null;
        }
    };

    return (
        <BeautyInsiderModuleLayout
            title={getText('rewardsActivity')}
            isSingleContentZone={true}
            headerCtaTitle={headerCtaTitle}
            content={contentZone(props.content)}
        />
    );
};

export default wrapFunctionalComponent(RewardsRedeemed, 'RewardsRedeemed');
