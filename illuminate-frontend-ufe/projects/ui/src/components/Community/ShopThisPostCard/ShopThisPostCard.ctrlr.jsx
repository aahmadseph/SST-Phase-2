import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Image, Text, Box, Button
} from 'components/ui';
import {
    buttons, colors, space, mediaQueries, radii
} from 'style/config';
import quicklookModalUtils from 'utils/Quicklook';
import snbApi from 'services/api/search-n-browse';
import uiUtils from 'utils/UI';
import CommunityPageBindings from 'analytics/bindingMethods/pages/community/CommunityPageBindings';

const { SKELETON_ANIMATION } = uiUtils;

class ShopThisPostCard extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            product: null,
            error: false,
            showSkeleton: true
        };
    }

    getProductDetails = skuId => {
        snbApi
            .getSkuDetails(skuId)
            .then(data => {
                if (data) {
                    this.setState({
                        product: {
                            productId: data?.primaryProduct?.productId,
                            brandName: data?.primaryProduct?.brand?.displayName,
                            skuType: data?.type?.toLowerCase(),
                            title: data?.primaryProduct?.displayName,
                            listPrice: data?.listPrice,
                            salePrice: data?.salePrice,
                            variationType: data?.variationType,
                            variationValue: data?.variationValue
                        },
                        error: false,
                        showSkeleton: false
                    });
                }
            })
            .catch(() => {
                this.props.addError(skuId);
                this.setState({
                    error: true
                });
            });
    };

    componentDidMount() {
        this.getProductDetails(this.props.item.sku);
    }
    componentDidUpdate(prevProps) {
        if (this.props.item.id !== prevProps.item.id) {
            this.getProductDetails(this.props.item.sku);
        }
    }
    handleClick = e => {
        e.preventDefault();
        e.stopPropagation();
        const {
            album_photo_id: albumId,
            content_type: contentType,
            user_name: userName,
            source,
            products,
            loves,
            categories
        } = this.props.galleryItem;
        quicklookModalUtils.dispatchQuicklook({
            productId: this.state.product?.productId,
            skuType: this.state.product?.skuType,
            options: {},
            sku: {
                skuId: this.props.item.sku
            },
            isCommunityGallery: true,
            communityGalleryAnalytics: CommunityPageBindings.geteVar129({
                albumId,
                contentType,
                userName,
                source,
                products,
                loves: loves?.count || 0,
                isIncentivized: categories?.includes('Incentivized')
            })
        });
    };
    render() {
        if (this.state.error) {
            return null;
        }

        return (
            <>
                <Box
                    ref={this.ref}
                    is={'div'}
                    width='250px'
                    fontSize='base'
                    lineHeight='tight'
                    backgroundColor='white'
                    borderRadius={2}
                    textAlign='left'
                    boxShadow='light'
                    overflow='hidden'
                    paddingY={4}
                    paddingX={3}
                    data-at={Sephora.debug.dataAt('product_item_container')}
                >
                    <Box
                        display='flex'
                        position='relative'
                    >
                        <Box
                            position='relative'
                            marginX='auto'
                            width={'60px'}
                            maxWidth='100%'
                        >
                            {this.state.showSkeleton ? (
                                <div css={[styles.skeleton.image, SKELETON_ANIMATION]} />
                            ) : (
                                <div
                                    css={{
                                        position: 'relative',
                                        display: 'block',
                                        paddingBottom: '100%'
                                    }}
                                >
                                    <Image
                                        src={this.props.item.image}
                                        css={{
                                            position: 'absolute',
                                            top: '0px',
                                            left: '0px'
                                        }}
                                    />
                                </div>
                            )}
                        </Box>
                        <div css={[styles.infoWrap, styles.infoWrapHorizontal]}>
                            <div css={styles.nameWrap}>
                                <Text
                                    display='block'
                                    fontSize='sm'
                                    marginBottom='2px'
                                    fontWeight='bold'
                                    lineHeight='tight'
                                    numberOfLines={1}
                                    css={this.state.showSkeleton && [styles.skeleton.text, SKELETON_ANIMATION]}
                                    data-at={Sephora.debug.dataAt('product_brand_label')}
                                    dangerouslySetInnerHTML={{
                                        __html: this.state.product?.brandName
                                    }}
                                />
                                <Text
                                    fontSize='sm'
                                    lineHeight='tight'
                                    numberOfLines={2}
                                    marginBottom='2px'
                                    css={this.state.showSkeleton && [styles.skeleton.text, SKELETON_ANIMATION]}
                                    data-at={Sephora.debug.dataAt('product_name_label')}
                                    dangerouslySetInnerHTML={{
                                        __html: this.state.product?.title
                                    }}
                                />
                                {this.state.product?.variationValue && !this.state.showSkeleton && (
                                    <Text
                                        display='block'
                                        color='gray'
                                        marginTop='.25em'
                                        fontSize='sm'
                                        numberOfLines={1}
                                        children={`${this.state.product?.variationType}: ${this.state.product?.variationValue}`}
                                    />
                                )}
                            </div>
                        </div>
                        <Text
                            css={styles.priceHorizontal}
                            fontWeight='bold'
                        >
                            {this.state.showSkeleton ? (
                                <span css={[styles.skeleton.price, SKELETON_ANIMATION]}>&nbsp;</span>
                            ) : (
                                <>
                                    {this.state.product?.salePrice && (
                                        <>
                                            <span
                                                data-at={Sephora.debug.dataAt('product_sale_price')}
                                                css={styles.priceSale}
                                                children={this.state.product?.salePrice}
                                            />{' '}
                                        </>
                                    )}
                                    <span
                                        data-at={Sephora.debug.dataAt('product_list_price')}
                                        css={this.state.product?.salePrice && styles.priceList}
                                        children={this.state.product?.listPrice}
                                    />
                                </>
                            )}
                        </Text>
                    </Box>
                    <div css={{ textAlign: 'center', marginTop: '12px' }}>
                        <Button
                            variant={'secondary'}
                            children={this.props.localization.seeDetails}
                            size={'sm'}
                            width='130px'
                            onClick={e => this.handleClick(e)}
                        />
                    </div>
                </Box>
            </>
        );
    }
}

const styles = {
    infoWrap: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    },
    infoWrapHorizontal: {
        paddingLeft: space[2]
    },
    nameWrap: {
        minHeight: 45,
        [mediaQueries.sm]: {
            minHeight: 51
        }
    },
    priceHorizontal: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'right'
    },
    priceList: {
        fontWeight: 'var(--font-weight-normal)',
        textDecoration: 'line-through'
    },
    priceSale: {
        color: colors.red,
        order: -1
    },
    skeleton: {
        image: {
            borderRadius: radii[2],
            paddingBottom: '100%'
        },
        text: {
            borderRadius: radii.full
        },
        price: {
            display: 'block',
            width: '3em',
            borderRadius: radii.full
        },
        rating: {
            width: '6em',
            height: '1em',
            borderRadius: radii.full
        },
        button: {
            borderRadius: radii.full,
            height: buttons.HEIGHT_SM,
            width: 68
        }
    }
};

export default wrapComponent(ShopThisPostCard, 'ShopThisPostCard', true);
