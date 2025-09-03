/* eslint-disable complexity */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import auth from 'utils/Authentication';
import BccUtils from 'utils/BCC';
import localeUtils from 'utils/LanguageLocale';
import anaUtils from 'analytics/utils';

import { space } from 'style/config';
import {
    Box, Flex, Button, Link
} from 'components/ui';
import ProductDisplayName from 'components/Product/ProductDisplayName/ProductDisplayName';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductQuicklook from 'components/Product/ProductQuicklook/ProductQuicklook';
import AddToBasketButton from 'components/AddToBasketButton';
import ProductBadges from 'components/Product/ProductBadges/ProductBadges';
import basketUtils from 'utils/Basket';
import urlUtils from 'utils/Url';
import skuUtils from 'utils/Sku';
import anaConstants from 'analytics/constants';
import { getImageAltText } from 'utils/Accessibility';
import { HEADER_VALUE } from 'constants/authentication';

const { IMAGE_SIZES } = BccUtils;
const { ADD_TO_BASKET_TYPES: ADD_BUTTON_TYPE } = basketUtils;

class RewardItem extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            hover: false,
            isBIPointsAvailable: true
        };
    }

    componentDidMount() {
        /**
         * Watch any changes on rewards Store
         * If any status of reward on the page has changed,
         * it means that every other reward should react on it.
         * (possibly, user doesn't have enough points for current one,
         * or reward now is in basket already)
         */

        store.setAndWatch('basket', this, this.setRewardState);

        skuUtils.isRewardDisabled(this.props).then(isRewardDisabled => {
            this.setState({ isRewardDisabled });
        });

        skuUtils.isEligible(this.props).then(isEligible => {
            this.setState({ isEligible });
        });
    }

    setRewardState = data => {
        if (data && this) {
            this.setState({ isBIPointsAvailable: data.basket.isBIPointsAvailable });
        }
    };

    getDataAtButtonString = () => {
        const buttonString = this.props.isInBasket ? 'reward_remove_btn' : 'reward_add_to_basket_btn';

        return buttonString;
    };

    getCtaText = () => {
        const getText = localeUtils.getLocaleResourceFile('components/Reward/RewardItem/locales', 'RewardItem');
        const { currentSku } = this.props;
        const isShortButton = this.props.isShortButton || (currentSku && currentSku.imageSize === IMAGE_SIZES[97]);

        if (this.props.isShowAddFullSize) {
            return getText('addFullSize');
        }

        if (!this.props.isInBasket) {
            return getText(isShortButton ? 'addToBasketShort' : 'addToBasket');
        }

        return getText('remove');
    };

    hoverOn = () => {
        this.setState({ hover: true });
    };

    hoverOff = () => {
        this.setState({ hover: false });
    };

    signInHandler = e => {
        e.preventDefault();
        const { analyticsContext } = this.props;
        const analyticsData = {
            context: analyticsContext,
            nextPageContext: analyticsContext
        };
        auth.requireAuthentication(null, null, analyticsData, null, false, HEADER_VALUE.USER_CLICK).catch(() => {});
    };

    redirectTo = href => e => {
        const { analyticsContext, isCarousel } = this.props;

        const recentEvent = anaUtils.getLastAsyncPageLoadData({ pageType: analyticsContext });

        anaUtils.setNextPageDataAndRedirect(e, {
            trackingData: { pageName: recentEvent.pageName },
            destination: href,
            ...(isCarousel && { events: [anaConstants.Event.EVENT_269] })
        });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Reward/RewardItem/locales', 'RewardItem');

        const {
            rootContainerName = '', isBasketReward = false, isBIRBReward, isInBasket, productStringContainerName
        } = this.props;

        const isLink = this.props.targetUrl && this.props.isLink;

        const Comp = isLink ? 'a' : 'div';

        const currentSku = this.props;

        const isDisabled = () => {
            if (this.state.isBIPointsAvailable) {
                return !isInBasket && (!this.state.isEligible || this.state.isRewardDisabled);
            } else {
                return true;
            }
        };

        const onHoverOn = !Sephora.isTouch ? this.hoverOn : null;
        const onHoverOff = !Sephora.isTouch ? this.hoverOff : null;

        const getPointsValue = sku => {
            let pointsValue = '';

            if (skuUtils.isBirthdayGift(sku)) {
                pointsValue = getText('birthday');
            } else if (skuUtils.isFree(sku)) {
                pointsValue = getText('free');
            } else if (sku.biType && !skuUtils.isRougeRewardCard(sku)) {
                pointsValue = sku.biType.toLowerCase();
            } else {
                pointsValue = sku.rewardPoints ? getText('priceInPoints', [sku.rewardPoints]) : '';
            }

            return pointsValue;
        };

        const img = (
            <ProductImage
                id={currentSku.skuId}
                size={currentSku.imageSize}
                skuImages={currentSku.skuImages}
                disableLazyLoad={currentSku.disableLazyLoad}
                isPageRenderImg={currentSku.isPageRenderImg}
                altText={getImageAltText(currentSku)}
            />
        );

        return (
            <Flex
                is={Comp}
                aria-label={`${currentSku.brandName} ${currentSku.productName}`}
                flexDirection='column'
                width='100%'
                textAlign='center'
                onMouseEnter={onHoverOn}
                onFocus={onHoverOn}
                onMouseLeave={onHoverOff}
                onBlur={onHoverOff}
                href={
                    isLink
                        ? urlUtils.addInternalTracking(currentSku.targetUrl, [currentSku.rootContainerName, currentSku.productId, 'product'])
                        : null
                }
                data-at={Sephora.debug.dataAt('reward_item')}
            >
                <Box position='relative'>
                    <div
                        css={{
                            position: 'relative',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            maxWidth: currentSku.imageSize
                        }}
                    >
                        {!isLink && isBasketReward && skuUtils.isRougeRewardCard(currentSku) ? (
                            <Link onClick={this.redirectTo(`/product/${currentSku.productId}`)}>{img}</Link>
                        ) : (
                            img
                        )}
                        <ProductQuicklook
                            isDisabled={isDisabled()}
                            isShown={this.state.hover}
                            sku={currentSku}
                            showQuickLookOnMobile={true}
                            analyticsContext={this.props.analyticsContext}
                            rootContainerName={rootContainerName}
                            productStringContainerName={productStringContainerName}
                            dataAt='reward_ql_btn'
                            isCarousel={this.props.isCarousel}
                        />
                    </div>

                    {this.props.badges && (
                        <ProductBadges
                            isSmall={true}
                            sku={currentSku}
                        />
                    )}

                    <Flex
                        justifyContent='center'
                        alignItems='center'
                        fontWeight='bold'
                        fontSize='xs'
                        height={space[5]}
                        css={{
                            textTransform: 'lowercase',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {this.props.isLimitedQuantity ? getText('limitedSupply') : this.props.isGoingFast ? getText('goingFast') : null}
                    </Flex>

                    <ProductDisplayName
                        numberOfLines={4}
                        brandName={currentSku.brandName}
                        productName={currentSku.productName}
                        atPrefix='reward'
                        isHovered={this.state.hover && isLink}
                    />

                    <Box
                        fontSize='sm'
                        lineHeight='tight'
                        marginTop={1}
                    >
                        <Box
                            fontWeight='bold'
                            data-at={Sephora.debug.dataAt('reward_type')}
                        >
                            {getPointsValue(currentSku)}
                        </Box>
                        {currentSku.valuePrice && currentSku.valuePrice}
                    </Box>
                </Box>

                {(currentSku.useAddToBasket || currentSku.isUseWriteReview) && (
                    <Box
                        paddingTop={3}
                        paddingBottom={1}
                        marginTop='auto'
                    >
                        {currentSku.useAddToBasket ? (
                            this.props.isAnonymous ? (
                                <Button
                                    variant='secondary'
                                    size='sm'
                                    onClick={e => this.signInHandler(e)}
                                >
                                    {getText('signInToAccess')}
                                </Button>
                            ) : (
                                <AddToBasketButton
                                    isRewardItem
                                    analyticsContext={this.props.analyticsContext || anaConstants.CONTEXT.BASKET_REWARDS}
                                    isBIRBReward={isBIRBReward}
                                    sku={this.props.isShowAddFullSize ? currentSku.fullSizeSku : currentSku}
                                    productId={currentSku.productId}
                                    productName={currentSku.productName}
                                    variant={ADD_BUTTON_TYPE.SECONDARY}
                                    disabled={this.props.isShowAddFullSize && false}
                                    text={this.getCtaText()}
                                    containerTitle={rootContainerName}
                                    isAddFullSize={this.props.isShowAddFullSize}
                                    data-at={Sephora.debug.dataAt(this.getDataAtButtonString())}
                                />
                            )
                        ) : (
                            <Button
                                variant='primary'
                                size='sm'
                                onClick={this.redirectTo(currentSku.targetUrl)}
                            >
                                {getText('writeAReview')}
                            </Button>
                        )}
                    </Box>
                )}
            </Flex>
        );
    }
}

export default wrapComponent(RewardItem, 'RewardItem');
