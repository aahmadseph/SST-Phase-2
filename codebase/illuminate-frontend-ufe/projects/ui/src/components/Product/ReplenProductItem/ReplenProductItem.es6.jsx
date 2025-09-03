/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { space } from 'style/config';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductQuicklook from 'components/Product/ProductQuicklook/ProductQuicklook';
import { getImageAltText } from 'utils/Accessibility';
import basketUtils from 'utils/Basket';
import AddToBasketButton from 'components/AddToBasketButton';
import analyticsConstants from 'analytics/constants';
import urlUtils from 'utils/Url';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';

const ADD_BUTTON_TYPE = basketUtils.ADD_TO_BASKET_TYPES;

class ReplenProductItem extends BaseClass {
    constructor(props) {
        super(props);

        this.state = { hover: false };
    }

    render() {
        const { sku, parentTitle } = this.props;
        const analyticsParentTitle = parentTitle.toLowerCase().replace(/\s/g, '_');
        const isTouch = Sephora.isTouch;
        const hoverOn = !isTouch ? this.hoverOn : null;
        const hoverOff = !isTouch ? this.hoverOff : null;

        return (
            <a
                href={urlUtils.addInternalTracking(sku.targetUrl, [analyticsParentTitle, sku.productId, 'product'])}
                css={styles.root}
                aria-label={`${sku.brandName} ${sku.productName}`}
                onMouseEnter={hoverOn}
                onFocus={hoverOn}
                onMouseLeave={hoverOff}
                onBlur={hoverOff}
                onClick={this.onClick}
            >
                <div css={styles.imgWrap}>
                    <ProductImage
                        size={75}
                        id={sku.skuId}
                        skuImages={sku.skuImages}
                        altText={getImageAltText(sku)}
                    />
                    <ProductQuicklook
                        isShown={this.state.hover}
                        sku={sku}
                        productStringContainerName={analyticsParentTitle}
                        rootContainerName={anaConsts.CAROUSEL_NAMES.REPLEN}
                    />
                </div>
                <div css={styles.btnWrap}>
                    <AddToBasketButton
                        size='sm'
                        sku={sku}
                        variant={ADD_BUTTON_TYPE.SECONDARY}
                        isAddButton={true}
                        analyticsContext={analyticsConstants.CONTEXT.REPLEN_PRODUCT}
                    />
                </div>
            </a>
        );
    }

    hoverOn = () => {
        this.setState({ hover: true });
    };

    hoverOff = () => {
        this.setState({ hover: false });
    };

    onClick = () => {
        const { sku, parentTitle } = this.props;

        const analyticsParentTitle = parentTitle.toLowerCase().replace(/\s/g, '_');

        anaUtils.setNextPageData({
            recInfo: {
                isExternalRec: 'sephora',
                componentTitle: parentTitle
            },
            internalCampaign: [analyticsParentTitle, sku.productId, 'product'].join(':')
        });
    };
}

const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    imgWrap: {
        display: 'flex',
        justifyContent: 'center',
        position: 'relative'
    },
    btnWrap: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: space[2],
        marginTop: 'auto'
    }
};

export default wrapComponent(ReplenProductItem, 'ReplenProductItem');
