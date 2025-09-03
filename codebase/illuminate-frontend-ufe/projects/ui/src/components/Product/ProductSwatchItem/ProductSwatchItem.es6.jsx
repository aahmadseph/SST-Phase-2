import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import skuUtils from 'utils/Sku';
import store from 'Store';
import swatchUtils from 'utils/Swatch';
import SwatchButton from 'components/ProductPage/Swatches/SwatchButton';
import SwatchImage from 'components/ProductPage/Swatches/SwatchImage';
import SwatchChiclet from 'components/ProductPage/Swatches/SwatchChiclet';
import keyConsts from 'utils/KeyConstants';
import testTargetUtils from 'utils/TestTarget';
import anaConsts from 'analytics/constants';

const { getSwatchType } = swatchUtils;

class ProductSwatchItem extends BaseClass {
    render() {
        /* eslint-disable prefer-const */
        let {
            index, product, sku, activeSku = {}, colorIqSku, actionFlags
        } = this.props;
        /* eslint-enable prefer-const */

        const isMatch = colorIqSku === sku;

        const { skuSelectorType } = product;

        activeSku = activeSku || {};

        const isReservationNotOffered = actionFlags && actionFlags.isReservationNotOffered ? actionFlags.isReservationNotOffered : null;

        const isImageType = skuSelectorType === skuUtils.skuSwatchType.IMAGE;

        const swatchTypeStyle = getSwatchType(product.swatchType);

        const isActive = sku.skuId === activeSku.skuId;

        const swatchProps = {
            isOnSale: sku.salePrice,
            isNew: sku.isNew,
            isOutOfStock: sku.isOutOfStock || isReservationNotOffered
        };

        return (
            <SwatchButton
                type={swatchTypeStyle}
                isActive={isActive}
                isImage={isImageType}
                data-at={isActive ? Sephora.debug.dataAt('selected_swatch') : Sephora.debug.dataAt('swatch')}
                aria-selected={isActive}
                aria-live='polite'
                aria-atomic={true}
                aria-describedby={this.getAriaDescribedById(skuSelectorType)}
                aria-label={[
                    sku.isOutOfStock && !sku.isComingSoonTreatment ? 'Out of stock: ' : null,
                    sku.isComingSoonTreatment ? 'Coming soon: ' : null,
                    sku.variationValue,
                    sku.variationDesc ? ' ' + sku.variationDesc : null,
                    isActive ? ' - Selected' : null
                ].join('')}
                onClick={() => {
                    this.props.handleSkuOnClick(sku);
                    this.updateDigitalDataProduct(this.props.isQuickLookModal ? product : store.getState().page.product, sku);
                }}
                onMouseEnter={() => this.props.handleSkuOnMouseEnter(sku)}
                onMouseLeave={() => this.props.handleSkuOnMouseLeave()}
                onFocus={() => this.props.handleSkuOnMouseEnter(sku)}
                onBlur={() => this.props.handleSkuOnMouseLeave()}
                onKeyDown={e => this.handleKeyDown(e, index)}
            >
                {isImageType && (
                    <SwatchImage
                        src={sku.smallImage}
                        type={swatchTypeStyle}
                        isMatch={isMatch}
                        {...swatchProps}
                    />
                )}

                {isImageType || (
                    <SwatchChiclet
                        {...swatchProps}
                        isActive={isActive}
                        children={skuSelectorType === skuUtils.skuSwatchType.TEXT ? sku.swatchText : sku.size}
                    />
                )}
            </SwatchButton>
        );
    }

    getAriaDescribedById = skuType => {
        switch (skuType) {
            case skuUtils.skuSwatchType.SIZE:
                return skuUtils.ARIA_DESCRIBED_BY_IDS.SIZE_SWATCH;
            case skuUtils.skuSwatchType.IMAGE:
                return skuUtils.ARIA_DESCRIBED_BY_IDS.COLOR_SWATCH;
            default:
                return null;
        }
    };

    handleKeyDown = (e, index) => {
        const btn = e.target;
        const grid = btn.parentNode.parentNode;
        const cells = grid.childNodes;
        const lastCell = cells.length - 1;

        const setFocus = i => cells[i].firstChild.focus();

        switch (e.key) {
            case keyConsts.END:
                e.preventDefault();
                setFocus(lastCell);

                break;
            case keyConsts.HOME:
                e.preventDefault();
                setFocus(0);

                break;
            case keyConsts.RIGHT:
            case keyConsts.DOWN:
                e.preventDefault();

                if (index === lastCell) {
                    setFocus(0);
                } else {
                    setFocus(index + 1);
                }

                break;
            case keyConsts.LEFT:
            case keyConsts.UP:
                e.preventDefault();

                if (index === 0) {
                    setFocus(lastCell);
                } else {
                    setFocus(index - 1);
                }

                break;
            default:
                break;
        }
    };

    updateDigitalDataProduct = (product, sku) => {
        const digitalDataProductList = digitalData.product;
        const { isQuickLookModal } = this.props;

        if (digitalDataProductList.length) {
            digitalData.product.shift();
        }

        testTargetUtils.updateDigitalProductObject(product, isQuickLookModal && digitalDataProductList.length > 0, sku);

        if (isQuickLookModal) {
            window.dispatchEvent(new Event(anaConsts.SNAPCHAT_QUICK_LOAD_EVENT));
            window.dispatchEvent(new Event(anaConsts.PINTEREST_QUICK_LOAD_EVENT));
        } else {
            window.dispatchEvent(new Event(anaConsts.SNAPCHAT_PRODUCT_PAGE_VIEW_EVENT));
            window.dispatchEvent(new Event(anaConsts.PINTEREST_PRODUCT_PAGE_VIEW_EVENT));
        }
    };
}

export default wrapComponent(ProductSwatchItem, 'ProductSwatchItem');
