import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'Store';
import ProductActions from 'actions/ProductActions';
import UI from 'utils/UI';
import anaUtils from 'analytics/utils';
import LocationUtils from 'utils/Location';
import historyLocationActions from 'actions/framework/HistoryLocationActions';
import anaConsts from 'analytics/constants';

import { Grid, Button } from 'components/ui';
import skuUtils from 'utils/Sku';
import Reward from 'components/GlobalModals/QuickLookModal/ProductQuickLookModal/CallToActions/Type/Reward/Reward';
import AddToBasketButton from 'components/AddToBasketButton';
import BasketUtil from 'utils/Basket';
import BiQualify from 'components/BiQualify/BiQualify';
import analyticsConsts from 'analytics/constants';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const { ADD_TO_BASKET_TYPES: ADD_BUTTON_TYPE } = BasketUtil;

class CallToActions extends BaseClass {
    openCustomSets = () => {
        store.dispatch(historyLocationActions.goTo({ anchor: LocationUtils.PAGES.CUSTOM_SETS_HASH }));
        UI.scrollToTop();
        store.dispatch(ProductActions.toggleCustomSets(true));
    };

    viewDetailsLinkTracking = (productId, displayName) => () => {
        const pageType = anaConsts.PAGE_TYPES.QUICK_LOOK;
        const actionInfo = `${pageType}:${productId}:View Details`;
        const world = digitalData.page.attributes.world;
        const pageName = `${pageType}:${productId}:${world}:*pname=${displayName}`;

        anaUtils.setNextPageData({
            linkData: actionInfo,
            internalCampaign: actionInfo,
            pageName,
            pageType
        });
    };

    handleOpenProductPage = e => {
        this.props.openProductPage(e);
    };

    handleDefault = () => {
        const { currentProduct } = this.props;
        const { currentSku, productDetails = {} } = currentProduct;
        const { productId, displayName } = productDetails;

        const productUrl = skuUtils.getViewDetailsUrl(currentSku, currentProduct);

        const getText = getLocaleResourceFile('components/GlobalModals/QuickLookModal/ProductQuickLookModal/CallToActions/locales', 'CallToActions');

        return (
            <div>
                {skuUtils.isBiExclusive(currentSku) && (
                    <BiQualify
                        fontSize='base'
                        marginBottom={2}
                        currentSku={currentSku}
                    />
                )}
                <Grid
                    gap={2}
                    columns={productUrl && !currentSku.isExternallySellable ? 2 : 1}
                >
                    {productUrl && !this.props.isCommunityGallery && (
                        <div>
                            <Button
                                block={true}
                                onClick={this.viewDetailsLinkTracking(productId, displayName)}
                                variant='secondary'
                                href={productUrl}
                            >
                                {currentSku.fullSizeProductUrl || currentSku.fullSizeSku ? getText('viewFullSizeLabel') : getText('viewDetailsLabel')}
                            </Button>
                        </div>
                    )}
                    {productUrl && this.props.isCommunityGallery && (
                        <Button
                            variant='secondary'
                            onClick={this.handleOpenProductPage}
                            children={getText('seeFullDetails')}
                        />
                    )}
                    <div>
                        {currentSku.isExternallySellable ? null : (
                            <AddToBasketButton
                                isQuickLook={true}
                                product={currentProduct}
                                productId={productDetails.productId}
                                block={true}
                                sku={currentSku}
                                variant={ADD_BUTTON_TYPE.SPECIAL}
                                platform={this.props.platform}
                                analyticsContext={analyticsConsts.CONTEXT.QUICK_LOOK}
                                isCommunityGallery={this.props.isCommunityGallery}
                                onSuccess={this.props.onSuccess}
                            />
                        )}
                    </div>
                </Grid>
            </div>
        );
    };

    render() {
        const { currentProduct } = this.props;
        const { currentSku } = currentProduct;

        let content;

        if (currentSku.isOutOfStock) {
            content = this.handleDefault();
        } else {
            switch (skuUtils.getProductType(currentSku)) {
                case skuUtils.skuTypes.REWARD:
                    content = <Reward currentProduct={currentProduct} />;

                    break;

                default: {
                    content = this.handleDefault();

                    break;
                }
            }
        }

        return <div css={{ textAlign: 'center' }}>{content}</div>;
    }
}

export default wrapComponent(CallToActions, 'CallToActions');
