/* eslint-disable object-curly-newline */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BccUtils from 'utils/BCC';
import store from 'Store';
import Actions from 'actions/Actions';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import { Grid } from 'components/ui';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductDisplayName from 'components/Product/ProductDisplayName/ProductDisplayName';
import analyticsConstants from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import { CONSTRUCTOR_PODS } from 'constants/constructorConstants';
import ConstructorCarousel from 'components/ConstructorCarousel';

const { IMAGE_SIZES } = BccUtils;

class SimilarProductsModal extends BaseClass {
    requestClose = () => {
        store.dispatch(Actions.showSimilarProductsModal({ isOpen: false }));
    };

    setAnalyticsTrackingOnRender = recommendedTitle => {
        const pageName = 'user profile:similar products modal:n/a:*';
        let linkData;

        if (this.props.analyticsData?.linkData) {
            linkData = `${this.props.analyticsData.linkData}:${recommendedTitle}`;
        }

        const data = {
            pageName,
            linkData
        };
        processEvent.process(analyticsConstants.ASYNC_PAGE_LOAD, { data });
    };

    render() {
        const { isOpen, itemId, brandName, productName, productImages, isYouMayAlsoLike, skuId } = this.props;

        const podId = isYouMayAlsoLike ? CONSTRUCTOR_PODS.PURCHASE_HISTORY : CONSTRUCTOR_PODS.SIMILAR_PRODUCTS_CONTENT_PAGE;
        const params = { itemIds: itemId };

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.requestClose}
                width={5}
                hasBodyScroll={true}
            >
                <Modal.Header isLeftAligned={true}>
                    <Modal.Title>
                        <Grid
                            columns='auto 1fr'
                            alignItems='center'
                            textAlign='left'
                            gap={4}
                        >
                            <ProductImage
                                id={skuId}
                                size={IMAGE_SIZES[50]}
                                skuImages={productImages}
                                disableLazyLoad={true}
                            />
                            <ProductDisplayName
                                fontSize='md'
                                brandName={brandName}
                                productName={productName}
                            />
                        </Grid>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ConstructorCarousel
                        podId={podId}
                        params={params}
                        closeParentModal={this.requestClose}
                    />
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(SimilarProductsModal, 'SimilarProductsModal', true);
