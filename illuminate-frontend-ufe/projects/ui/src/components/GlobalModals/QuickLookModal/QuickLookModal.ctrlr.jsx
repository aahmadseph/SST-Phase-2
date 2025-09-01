import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'Store';
import actions from 'Actions';

import { space } from 'style/config';
import ProductQuickLookModal from 'components/GlobalModals/QuickLookModal/ProductQuickLookModal';
import RewardSampleQuickLookModal from 'components/GlobalModals/QuickLookModal/RewardSampleQuickLookModal/RewardSampleQuickLookModal';
import urlUtils from 'utils/Url';
import skuUtils from 'utils/Sku';
import BccUtils from 'utils/BCC';

const { IMAGE_SIZES } = BccUtils;

class QuickLookModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            currentSku: null
        };
    }

    componentDidMount() {
        const defaultSku = this.getDefaultSku(this.props.product);
        this.updateCurrentSku(defaultSku);
    }

    getDefaultSku = product => {
        let defaultSku = null;

        if (product && product.currentSku) {
            defaultSku = product.currentSku;

            return defaultSku;
        } else {
            return product;
        }
    };

    updateCurrentSku = currentSku => {
        let newSku = { ...currentSku };

        if (Sephora.isAgent && Sephora.isAgentAuthorizedRole) {
            //If it is Sephora Mirror and extension is installed then agents can see app exclusive products as regular products
            newSku = { ...currentSku, isAppExclusive: false };
        }

        this.setState({ currentSku: newSku });
    };

    requestClose = (isMobileFullSize, isSample = false) => {
        if (digitalData.product[0] && digitalData.product[0].attributes.quickLookAdded) {
            digitalData.product.shift();
        }

        store.dispatch(actions.showQuickLookModal({ isOpen: false }));

        if (isMobileFullSize) {
            store.dispatch(actions.showRewardModal(false));

            if (isSample) {
                store.dispatch(actions.showSampleModal(false));
            }
        }
    };

    render() {
        const {
            isOpen,
            product,
            error,
            platform,
            origin,
            analyticsContext,
            productStringContainerName,
            rootContainerName,
            sku,
            skuType,
            isDisabled,
            categoryProducts,
            isCommunityGallery = false,
            communityGalleryAnalytics
        } = this.props;

        const currentSku = this.state.currentSku || this.getDefaultSku(product);
        const imageSize = IMAGE_SIZES[300];
        const leftColWidth = imageSize + space[5];

        if (this.props.skuType === skuUtils.skuTypes.STANDARD) {
            return (
                <ProductQuickLookModal
                    isOpen={isOpen}
                    requestClose={this.requestClose}
                    product={product}
                    currentSku={currentSku}
                    updateCurrentSku={this.updateCurrentSku}
                    matchSku={urlUtils.getParamsByName('shade_code')}
                    error={error}
                    platform={platform}
                    origin={origin}
                    analyticsContext={analyticsContext}
                    productStringContainerName={productStringContainerName}
                    rootContainerName={rootContainerName}
                    categoryProducts={categoryProducts}
                    isCommunityGallery={isCommunityGallery}
                    communityGalleryAnalytics={communityGalleryAnalytics}
                />
            );
        } else {
            return (
                <RewardSampleQuickLookModal
                    isOpen={isOpen}
                    requestClose={this.requestClose}
                    product={product}
                    currentSku={{ ...sku, ...currentSku }}
                    skuType={skuType}
                    imageSize={imageSize}
                    platform={platform}
                    leftColWidth={leftColWidth}
                    analyticsContext={analyticsContext}
                    rootContainerName={rootContainerName}
                    isDisabled={isDisabled}
                />
            );
        }
    }
}

export default wrapComponent(QuickLookModal, 'QuickLookModal');
