import store from 'Store';
import BaseClass from 'components/BaseClass';
import Flag from 'components/Flag/Flag';
import React from 'react';
import {
    fontSizes, lineHeights, mediaQueries, space
} from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import marketingFlagsUtil from 'utils/MarketingFlags';
import skuUtils from 'utils/Sku';
import { wrapComponent } from 'utils/framework';

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/Swatches/locales', 'Swatches');

class SwatchDescription extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {};

        store.setAndWatch({ 'page.product': 'product' }, this, null, store.STATE_STRATEGIES.DIRECT_INIT);
    }

    getBadges = sku => {
        const flags = marketingFlagsUtil.getShadeFilterFlags(sku);

        return flags.length
            ? flags.map(({ text, backgroundColor }, index) => (
                <Flag
                    key={index.toString()}
                    data-at={Sephora.debug.dataAt('product_flag_label')}
                    children={text}
                    width='max-content'
                    backgroundColor={backgroundColor}
                    marginRight={1}
                />
            ))
            : null;
    };

    render() {
        const { product } = this.state;

        const { hoveredSku, currentSku, skuSelectorType } = product;

        const hasVariation = product.variationType !== skuUtils.skuVariationType.NONE;
        const sku = hoveredSku || currentSku;
        const skuBadges = this.getBadges(sku);

        let { variationTypeDisplayName } = product;

        if (skuUtils.isFragrance(product, sku)) {
            variationTypeDisplayName = getText('size');
        }

        if (!skuBadges && !sku?.variationValue) {
            return null;
        }

        return !(skuSelectorType === skuUtils.skuSwatchType.NONE || !hasVariation) ? (
            <div
                data-at={Sephora.debug.dataAt('sku_name_label')}
                css={
                    this.props.hasMinHeight && {
                        [mediaQueries.md]: {
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitBoxPack: 'end',
                            minHeight: fontSizes.base * lineHeights.tight * 2
                        }
                    }
                }
            >
                {sku.variationValue && (
                    <span css={{ marginRight: space[1] }}>
                        {variationTypeDisplayName && `${variationTypeDisplayName}: `}
                        {sku.variationValue}
                        {sku.variationDesc && ` - ${sku.variationDesc}`}
                    </span>
                )}
                {skuBadges}
            </div>
        ) : (
            <div data-at={Sephora.debug.dataAt('product_refinement')}>{skuBadges}</div>
        );
    }
}

export default wrapComponent(SwatchDescription, 'SwatchDescription');
