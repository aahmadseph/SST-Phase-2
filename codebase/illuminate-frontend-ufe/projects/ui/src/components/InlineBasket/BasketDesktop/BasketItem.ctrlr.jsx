/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import AddToBasketActions from 'actions/AddToBasketActions';
import store from 'store/Store';
import Authentication from 'utils/Authentication';
import LoveActions from 'actions/LoveActions';
import promoUtils from 'utils/Promos';
import basketConstants from 'constants/Basket';
import Location from 'utils/Location';
import anaUtils from 'analytics/utils';

import { colors, space } from 'style/config';
import {
    Box, Flex, Grid, Text, Link, Divider
} from 'components/ui';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import ErrorMsg from 'components/ErrorMsg';
import skuUtils from 'utils/Sku';
import BCCUtils from 'utils/BCC';
import localeUtils from 'utils/LanguageLocale';
import skuHelpers from 'utils/skuHelpers';
import { HEADER_VALUE } from 'constants/authentication';

const { IMAGE_SIZES } = BCCUtils;

class BasketItem extends BaseClass {
    constructor(props) {
        super(props);

        this.state = { isHover: false, isLoved: false };
    }

    componentDidMount() {
        store.setAndWatch('loves.shoppingListIds', this, _ => {
            const isLoved = skuHelpers.isSkuLoved(this.props.item.sku.skuId);

            if (isLoved !== this.state.isLoved) {
                this.setState({ isLoved });
            }
        });
    }

    onMouseEnterHandler = () => {
        this.setState({ isHover: true });
    };

    onMouseLeaveHandler = () => {
        this.setState({ isHover: false });
    };

    removeItemFromBasket = () => {
        store.dispatch(AddToBasketActions.removeItemFromBasket(this.props.item, true, null, this.props.isRopis, this.props.appliedPromotions));
    };

    handleLoveRequest = (item, callback) => {
        const loveRequest = {
            loveSource: 'basket',
            skuId: item.sku.skuId,
            productId: item.sku.productId
        };

        if (this.props.isRopis) {
            loveRequest.isRopisSku = this.props.isRopis;
        }

        store.dispatch(LoveActions.addLove(loveRequest, callback));
    };

    handleLinkClick = (e, targetUrl) => {
        Location.navigateTo(e, targetUrl);
        // Need to reset the internalCampaign as the user did not click inside a carousel. This impacts
        // eVar52 which gets added incorrectly. UTS-1907
        anaUtils.setNextPageData({ internalCampaign: '' });
    };

    handleMoveToLoveClick = () => {
        Authentication.requireAuthentication(null, null, null, null, false, HEADER_VALUE.USER_CLICK).then(() => {
            this.handleLoveRequest(this.props.item, response => {
                if (response && response.shoppingListMsgs) {
                    const promoWarning = response.shoppingListMsgs.find(
                        warning => warning.messageContext === basketConstants.SHOPPING_LIST_PROMO_WARNING
                    );

                    if (promoWarning && promoWarning.messages.length) {
                        promoUtils.showWarningMessage(promoWarning.messages[0]);
                    }
                }

                store.dispatch(AddToBasketActions.refreshBasket());

                const {
                    skuId, productName, brandName, variationValue, salePrice, listPrice
                } = this.props.item.sku;

                const googleAnalyticsChangedBasketData = {
                    id: skuId,
                    name: productName,
                    brand: brandName || '',
                    variant: variationValue || '',
                    quantity: this.props.item.qty || 1,
                    price: salePrice || listPrice
                };

                Sephora.analytics.promises.tagManagementSystemReady.then(() => {
                    import('analytics/addToCartPixels').then(addToCartPixels => {
                        addToCartPixels.default.googleAnalyticsRemoveFromBasketEvent(googleAnalyticsChangedBasketData);
                    });
                });
            });
        });
    };

    removeBlacklistedWarnings = warningMessages => {
        if (warningMessages && warningMessages.length) {
            return warningMessages.filter(msg => {
                return basketConstants.WARNING_BLACKLIST_MESSAGES.indexOf(msg.messageContext) === -1;
            });
        } else {
            return warningMessages;
        }
    };

    renderOutOfStockLabel = (sku, getText) => {
        if (skuUtils.isBiReward(sku)) {
            return getText('soldOut');
        }

        if (this.props.isRopis) {
            return getText('outOfStockAtStore');
        } else {
            return getText('outOfStock');
        }
    };

    handleLinkClickCb = targetUrl => e => {
        this.handleLinkClick(e, targetUrl);
    };

    renderItemLevelMessages = item => {
        return (this.removeBlacklistedWarnings(item.itemLevelMessages) || [])
            .map(itemLevelMessage => {
                if (itemLevelMessage && itemLevelMessage.messageContext) {
                    return !itemLevelMessage.messageContext.indexOf('outOfStock') ? itemLevelMessage.messages.join('') : null;
                } else {
                    return null;
                }
            })
            .join('');
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/InlineBasket/BasketDesktop/locales', 'BasketItem');

        const { item, index } = this.props;

        const hasVariation = item.sku.variationValue;
        const qtyDisplay =
            item.qty < 2 ? null : (
                <span
                    css={{
                        color: colors.gray,
                        marginLeft: '.25em'
                    }}
                    data-at={Sephora.debug.dataAt('inline_basket_sku_qty')}
                >
                    (x{item.qty})
                </span>
            );

        const displayName = (
            <React.Fragment>
                {item.sku.brandName && (
                    <React.Fragment>
                        <strong>{item.sku.brandName}</strong>
                        <br />
                    </React.Fragment>
                )}
                {item.sku.productName}
                {hasVariation || qtyDisplay}
            </React.Fragment>
        );

        const targetUrl = item.sku.fullSizeSku && item.sku.fullSizeSku.targetUrl ? item.sku.fullSizeSku.targetUrl : item.sku.targetUrl;

        return (
            <Box
                data-at={Sephora.debug.dataAt('inline_basket_item')}
                fontSize='sm'
            >
                {index > 0 && <Divider />}
                <Box
                    paddingY={3}
                    paddingX={4}
                    tabIndex={0}
                    onMouseEnter={this.onMouseEnterHandler}
                    onFocus={this.onMouseEnterHandler}
                    onMouseLeave={this.onMouseLeaveHandler}
                    onBlur={this.onMouseLeaveHandler}
                >
                    <ErrorMsg
                        marginBottom={2}
                        data-at={Sephora.debug.dataAt('inline_basket_item_warning')}
                        children={this.renderItemLevelMessages(item)}
                    />
                    <Grid
                        gap={2}
                        columns='auto 1fr auto'
                    >
                        <Box
                            href={targetUrl}
                            onClick={this.handleLinkClickCb(targetUrl)}
                        >
                            <ProductImage
                                id={item.sku.skuId}
                                size={IMAGE_SIZES[62]}
                                skuImages={item.sku.skuImages}
                                disableLazyLoad={true}
                            />
                        </Box>
                        <Flex flexDirection='column'>
                            {targetUrl ? (
                                <Link
                                    href={targetUrl}
                                    data-at={Sephora.debug.dataAt('inline_basket_sku_name')}
                                    onClick={this.handleLinkClickCb(targetUrl)}
                                >
                                    {displayName}
                                </Link>
                            ) : (
                                <span
                                    data-at={Sephora.debug.dataAt('inline_basket_sku_name')}
                                    children={displayName}
                                />
                            )}
                            {hasVariation && (
                                <div>
                                    <ProductVariation
                                        display='inline'
                                        fontSize='sm'
                                        data-at={Sephora.debug.dataAt('inline_basket_sku_variation')}
                                        {...skuUtils.getProductVariations({ sku: item.sku })}
                                    />
                                    {qtyDisplay}
                                </div>
                            )}
                            {item.sku.isOutOfStock && (
                                <Text
                                    is='p'
                                    fontWeight='bold'
                                    color='red'
                                    data-at={Sephora.debug.dataAt('inline_basket_sku_out_of_stock')}
                                >
                                    {this.renderOutOfStockLabel(item.sku, getText)}
                                </Text>
                            )}
                            {item.sku.actionFlags &&
                                !skuUtils.isSample(item.sku) &&
                                !skuUtils.isSDU(item.sku) &&
                                !item.sku.isOutOfStock &&
                                !this.state.isLoved &&
                                item.sku.actionFlags.myListStatus === 'notAdded' && (
                                <div
                                    css={{
                                        marginTop: 'auto',
                                        paddingTop: space[1]
                                    }}
                                >
                                    <Link
                                        padding={2}
                                        margin={-2}
                                        color='blue'
                                        data-at={Sephora.debug.dataAt('move_to_love_btn')}
                                        onClick={this.handleMoveToLoveClick}
                                        children={getText('moveToLoves')}
                                    />
                                </div>
                            )}
                        </Flex>
                        <Flex
                            flexDirection='column'
                            textAlign='right'
                        >
                            <div
                                css={{ fontWeight: 'var(--font-weight-bold)' }}
                                data-at={Sephora.debug.dataAt('inline_basket_sku_price')}
                            >
                                {item.sku.salePrice ? (
                                    <React.Fragment>
                                        <span
                                            css={{
                                                fontWeight: 'var(--font-weight-normal)',
                                                whiteSpace: 'nowrap',
                                                textDecoration: 'line-through'
                                            }}
                                            data-at={Sephora.debug.dataAt('inline_basket_sku_total_price')}
                                            children={item.listPriceSubtotal}
                                        />{' '}
                                        <span
                                            css={{
                                                color: colors.red,
                                                whiteSpace: 'nowrap'
                                            }}
                                            data-at={Sephora.debug.dataAt('inline_basket_sku_sale_price')}
                                            children={item.salePriceSubtotal}
                                        />
                                    </React.Fragment>
                                ) : (
                                    item.listPriceSubtotal
                                )}
                            </div>
                            {skuUtils.isGwp(item.sku) || (
                                <Link
                                    padding={2}
                                    margin={-2}
                                    marginTop='auto'
                                    color='blue'
                                    data-prevent-dropdown-closure
                                    css={{
                                        transition: 'opacity .2s',
                                        opacity: this.state.isHover || Sephora.isTouch ? 1 : 0
                                    }}
                                    onClick={this.removeItemFromBasket}
                                    children={getText('remove')}
                                />
                            )}
                        </Flex>
                    </Grid>
                </Box>
            </Box>
        );
    }
}

export default wrapComponent(BasketItem, 'BasketItem', true);
