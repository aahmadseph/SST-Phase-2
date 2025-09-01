import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    colors, fontWeights, fontSizes, radii, space
} from 'style/config';
import skuUtils from 'utils/Sku';
import languageLocale from 'utils/LanguageLocale';
import quicklookModalUtils from 'utils/Quicklook';
import helpersUtils from 'utils/Helpers';

const { deferTaskExecution } = helpersUtils;
const getText = languageLocale.getLocaleResourceFile('components/Product/ProductQuicklook/locales', 'ProductQuicklook');

class ProductQuicklook extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            isTouch: false
        };
    }

    componentDidMount() {
        this.setState({ isTouch: Sephora.isTouch });
    }

    handleShowQuickLookModal = (productId, skuType, options) => {
        const {
            sku, rootContainerName, productStringContainerName, origin, analyticsContext, isDisabled, podId, isCarousel
        } = this.props;

        quicklookModalUtils.dispatchQuicklook({
            productId,
            skuType,
            options,
            sku,
            rootContainerName,
            productStringContainerName,
            origin,
            analyticsContext,
            isDisabled,
            podId,
            isCarousel
        });
    };

    handleOnClick = e => {
        e.preventDefault();
        e.stopPropagation();

        const { sku, triggerAnalytics } = this.props;

        let productId = this.props.productId || sku.productId;

        if (triggerAnalytics) {
            deferTaskExecution(() => {
                triggerAnalytics();
            });
        }

        if (skuUtils.isBiReward(sku)) {
            const skuType = skuUtils.skuTypes.REWARD;
            this.handleShowQuickLookModal(productId, skuType);
        } else if (skuUtils.isSample(sku)) {
            const skuType = skuUtils.skuTypes.SAMPLE;
            productId = productId || (sku.primaryProduct ? sku.primaryProduct.productId : null);
            this.handleShowQuickLookModal(productId, skuType, { propertiesToSkip: 'childSkus' });
        } else {
            const skuType = skuUtils.skuTypes.STANDARD;
            this.handleShowQuickLookModal(productId, skuType, { addCurrentSkuToProductChildSkus: true });
        }
    };

    render() {
        const {
            isShown, buttonText, sku, showQuickLookOnMobile = false, tabIndex, dataAt
        } = this.props;

        const shouldShowQuickLookButton = Sephora.isDesktop() || showQuickLookOnMobile;

        const displayName = skuUtils.isSample(sku) ? sku.variationValue : sku.imageAltText || `${sku.brandName} ${sku.productName}`;

        return shouldShowQuickLookButton ? (
            <button
                tabIndex={tabIndex}
                css={[styles.button, this.state.isTouch ? styles.touch : [styles.noTouch, isShown && styles.buttonShow]]}
                type='button'
                onClick={this.handleOnClick}
                aria-label={getText('moreInfoText', [displayName])}
                data-at={Sephora.debug.dataAt(dataAt)}
                children={buttonText || getText('quickLookText')}
            />
        ) : null;
    }
}

const styles = {
    button: {
        cursor: 'pointer',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        opacity: 0,
        transition: 'opacity .3s'
    },
    buttonShow: {
        opacity: 1
    },
    noTouch: {
        textAlign: 'center',
        color: colors.white,
        lineHeight: 1,
        fontWeight: fontWeights.bold,
        paddingTop: space[2],
        paddingBottom: space[2],
        fontSize: fontSizes.sm,
        borderRadius: radii[2],
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        ':hover': {
            backgroundColor: 'rgba(102, 102, 102, 0.9)'
        }
    },
    /* on touch devices, make hit area the full image height */
    touch: {
        height: '100%'
    }
};

export default wrapComponent(ProductQuicklook, 'ProductQuicklook', true);
