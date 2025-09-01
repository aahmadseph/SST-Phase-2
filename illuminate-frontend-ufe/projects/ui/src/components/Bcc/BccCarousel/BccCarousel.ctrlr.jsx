/* eslint-disable complexity */
/* eslint-disable object-curly-newline */

import React from 'react';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import processEvent from 'analytics/processEvent';
import store from 'store/Store';
import bccUtils from 'utils/BCC';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Image, Link } from 'components/ui';
import LegacyCarousel from 'components/LegacyCarousel/LegacyCarousel';
import BccBase from 'components/Bcc/BccBase/BccBase';
import { fonts, fontSizes, lineHeights, space, radii } from 'style/config';
import UiUtils from 'utils/UI';
import { UserInfoReady } from 'constants/events';
import Empty from 'constants/empty';
import ProductItem from 'components/Product/ProductItem';
import RewardItem from 'components/Reward/RewardItem/RewardItem';

const { IMAGE_SIZES, COMPONENT_NAMES } = bccUtils;
const { SKELETON_ANIMATION } = UiUtils;

const createInitialState = props => {
    let items = props.carouselItems || [];
    items = items || [];

    return {
        carouselItems: items,
        totalItems: items.length,
        shouldDegrade: items.length === 0,
        isAnonymous: true,
        showABTestNumbers: false
    };
};

const getSkeletonItems = (count, imageSize) => {
    const items = [];

    for (let i = 0; i <= count; i++) {
        items.push(
            <div
                key={i}
                css={[styles.skeleton.item.root, { minHeight: imageSize + 84 }]}
            >
                <div css={[styles.skeleton.item.imageWrap, SKELETON_ANIMATION, { maxWidth: imageSize }]}>
                    <div css={[styles.skeleton.item.image, SKELETON_ANIMATION]} />
                </div>
                <div>
                    <div css={[styles.skeleton.item.text, SKELETON_ANIMATION]} />
                    <div css={[styles.skeleton.item.text, SKELETON_ANIMATION]} />
                    <div css={[styles.skeleton.item.text, SKELETON_ANIMATION]} />
                </div>
            </div>
        );
    }

    return items;
};

class BccCarousel extends BaseClass {
    state = createInitialState(this.props);

    getCarouselTop = compTitle => {
        const { showSkeleton } = this.state;

        if (this.state.shouldDegrade && !showSkeleton) {
            return null;
        }

        /* eslint-disable prefer-const */
        let { imagePath, subHead, moreTarget, alignment = 'center', mobileWebAlignment = 'left' } = this.props;
        /* eslint-enable prefer-const */

        const isMobile = Sephora.isMobile();

        const carouselTitle = this.getCarouselTitle(compTitle);
        const carouselMoreTarget = this.getCarouselMoreTarget(compTitle, subHead, moreTarget);

        return (
            <div
                css={{
                    position: 'relative',
                    marginBottom: this.props.titleMargin || (isMobile ? space[5] : space[6]),
                    textAlign: isMobile ? mobileWebAlignment.toLowerCase() : alignment.toLowerCase()
                }}
            >
                {carouselTitle}
                {subHead && (
                    <div
                        css={{
                            marginTop: compTitle || imagePath ? '.5em' : null,
                            fontSize: isMobile ? fontSizes.base : fontSizes.md
                        }}
                        data-at={Sephora.debug.dataAt('product_carousel_subtext')}
                    >
                        {showSkeleton ? <div css={[styles.skeleton.subhead, SKELETON_ANIMATION]}>&nbsp;</div> : subHead}
                    </div>
                )}
                {showSkeleton || carouselMoreTarget}
            </div>
        );
    };

    getCarouselTitle = compTitle => {
        const { titleStyle, isSmallTitle, imagePath, titleImageAltText } = this.props;

        return compTitle || imagePath ? (
            <div
                data-at={Sephora.debug.dataAt('product_carousel_title')}
                css={[
                    titleStyle
                        ? titleStyle
                        : {
                            lineHeight: 1,
                            fontFamily: fonts.serif,
                            fontSize: Sephora.isMobile() || isSmallTitle ? fontSizes.xl : fontSizes['2xl']
                        },
                    { marginRight: Sephora.isMobile() && this.state.moreTarget ? '75px' : null }
                ]}
            >
                {this.state.showSkeleton ? (
                    <div css={[styles.skeleton.title, SKELETON_ANIMATION]}>&nbsp;</div>
                ) : imagePath ? (
                    <Image
                        display='block'
                        marginX='auto'
                        src={imagePath}
                        alt={titleImageAltText || ''}
                    />
                ) : (
                    compTitle
                )}
            </div>
        ) : null;
    };

    setLinkNameTracking = () => {
        const title = (this.props?.title || this.props?.mobileWebTitleText || this.state?.title || '').trim().toLowerCase();
        anaUtils.setNextPageData({
            linkData: `${title}:carousel:show more`
        });
    };

    getCarouselMoreTarget = (compTitle, subHead, moreTarget) => {
        const getText = localeUtils.getLocaleResourceFile('components/Bcc/BccCarousel/locales', 'BccCarousel');
        const { imagePath } = this.props;

        return (
            moreTarget && (
                <div
                    data-at={Sephora.debug.dataAt('product_carousel_more_link')}
                    css={[
                        {
                            lineHeight: lineHeights.tight,
                            textAlign: 'right'
                        },
                        imagePath &&
                            !subHead && {
                            marginTop: space[3]
                        },
                        (subHead || (compTitle && !imagePath)) && {
                            position: 'absolute',
                            top: 0,
                            right: 0
                        }
                    ]}
                >
                    <Link
                        padding={2}
                        marginX={-2}
                        color='blue'
                        href={moreTarget.targetUrl}
                        onClick={this.setLinkNameTracking}
                        fontSize={['sm', 'base']}
                    >
                        {getText('showMore')}
                    </Link>
                </div>
            )
        );
    };

    getCarouselItems = (imageSize, compTitle) => {
        const isMobile = Sephora.isMobile();
        const {
            componentType,
            showSKUNumbering,
            showMarketingFlags,
            showLoves,
            showReviews,
            showPrice,
            formatValuePrice,
            displayCount,
            totalItems,
            isEnableCircle,
            name,
            useAddToBasket,
            showSignUpForEmail,
            isAddButton,
            hideProductName,
            hideBadges,
            disableLazyLoad = false,
            origin,
            showItemsFromProps,
            biRewards,
            enablePageRenderTracking = false
        } = this.props;

        const itemType = {
            [COMPONENT_NAMES.CAROUSEL]: ProductItem,
            [COMPONENT_NAMES.REWARDS_CAROUSEL]: RewardItem
        };

        const Item = itemType[componentType];

        const carouselItems = showItemsFromProps ? biRewards : this.state.carouselItems;

        return carouselItems.map((carouselItem, index) => {
            const item = Object.assign({}, carouselItem);

            if (!item.isBlank) {
                item.isLink = true;
                item.useAddToBasket = useAddToBasket;
                item.showSignUpForEmail = showSignUpForEmail;
                item.imageSize = imageSize;
                item.rootContainerName = compTitle || name;
                item.showPrice = showPrice;
                item.showReviews = showReviews;
                item.isAddButton = isAddButton;
                item.showLoves = showLoves;
                item.showMarketingFlags = showMarketingFlags;
                item.disableLazyLoad = disableLazyLoad;
                item.hideProductName = hideProductName;
                item.hideBadges = hideBadges;
                item.formatValuePrice = formatValuePrice;

                if (origin) {
                    item.origin = origin;
                }

                if (index < displayCount) {
                    // Enable render tracking support for visible carousel images
                    item.isPageRenderImg = enablePageRenderTracking;
                }

                // Now, AB test will be controlled via BCC only
                if (showSKUNumbering) {
                    item.displayNumber =
                        isEnableCircle && index + 1 > totalItems
                            ? index + (isMobile ? 2 : displayCount) - this.state.carouselItems.length + 1
                            : index + 1;
                }

                return (
                    <Item
                        key={item.skuId}
                        productReviewCount={item.reviewsCount || (item.primaryProduct ? item.primaryProduct.reviews : null)}
                        index={index + 1}
                        position={index}
                        rootName={this.props.rootName}
                        rootContainerName={this.props.rootName}
                        isAnonymous={this.state.isAnonymous}
                        internalCampaignString={this.props.internalCampaignString}
                        analyticsContext={this.props.analyticsContext}
                        containerTitle={this.props.name}
                        basketType={this.props.basketType}
                        isCarousel={true}
                        {...item}
                    />
                );
            } else {
                return <div></div>;
            }
        });
    };

    processCircle = skuList => skuList.concat(skuList.slice(0, this.props.displayCount));

    updateCarouselState = newState => {
        newState.showSkeleton = false;

        if (newState.carouselItems && Array.isArray(newState.carouselItems)) {
            newState.totalItems = newState.carouselItems.length;
            newState.shouldDegrade = newState.carouselItems && newState.carouselItems.length === 0;
        }

        if (this.props.isEnableCircle) {
            newState.carouselItems = this.processCircle(newState.carouselItems);
        }

        this.setState(newState);
    };

    trackPageChangeAnalytics =
        (nextPage = false) =>
            () => {
                const pageDirecction = nextPage ? 'next' : 'previous';
                const actionLink = 'Carousel :: Navigation';
                const carouselName = (this.props.title && this.props.title.toLowerCase()) || (this.state.title && this.state.title.toLowerCase());
                const internalCampaign = `product:${carouselName}:slide:click ${pageDirecction}`;

                const recentEvent = anaUtils.getLastAsyncPageLoadData({
                    pageType: this.props.analyticsContext
                });

                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        actionInfo: actionLink,
                        linkName: actionLink,
                        eventStrings: anaConsts.Event.EVENT_71,
                        internalCampaign: internalCampaign,
                        ...recentEvent
                    }
                });
            };

    componentDidMount() {
        Sephora.Util.onLastLoadEvent(window, [UserInfoReady], () => {
            store.setAndWatch('auth', this, data => {
                this.setState({
                    isAnonymous: userUtils.isAnonymous(data && data.user)
                });
            });
        });

        this.updateCarouselState({ carouselItems: (this.props.carouselItems || Empty.Array).slice() });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.carouselItems !== this.props.carouselItems) {
            this.updateCarouselState({ carouselItems: (this.props.carouselItems || Empty.Array).slice() });
        }
    }

    render() {
        /* eslint-disable prefer-const */
        let {
            displayCount,
            totalItems,
            title,
            mobileWebTitleText,
            isEnableCircle,
            skuImageSize,
            showArrows,
            name,
            showTouts,
            toggleOpen,
            podId,
            resultId,
            totalResults
        } = this.props;
        /* eslint-enable prefer-const */

        if (this.state.shouldDegrade && !this.state.showSkeleton) {
            return null;
        }

        const isMobile = Sephora.isMobile();
        const isDesktop = Sephora.isDesktop();

        const compTitle = isMobile ? mobileWebTitleText : title;

        if (this.state.showSkeleton) {
            totalItems = displayCount;
        }

        // if no arrows, ProductItem should be flush with its container
        const hasArrows = showArrows && isDesktop && totalItems > displayCount;

        const imageSize = skuImageSize || (isMobile ? IMAGE_SIZES[162] : IMAGE_SIZES[135]);

        const carouselIsReady = this.state.showSkeleton || !!(this.state.carouselItems && this.state.carouselItems.length > 0);

        const carouselTop = this.getCarouselTop(compTitle);
        const carouselItems = this.state.showSkeleton ? getSkeletonItems(displayCount, imageSize) : this.getCarouselItems(imageSize, compTitle);

        return (
            <BccBase
                dataAt={Sephora.debug.dataAt('product_carousel')}
                {...this.props}
            >
                {carouselIsReady && carouselTop}
                <LegacyCarousel
                    isSkeleton={this.state.showSkeleton}
                    displayCount={displayCount}
                    showTouts={showTouts}
                    showArrows={hasArrows}
                    totalItems={totalItems}
                    isEnableCircle={isEnableCircle}
                    name={name}
                    controlHeight={imageSize}
                    isFlexItem={true}
                    gutter={this.props.gutter || space[5]}
                    lazyLoad='img'
                    toggleOpen={toggleOpen}
                    analyticsContext={this.props.analyticsContext}
                    rightArrowCallback={this.trackPageChangeAnalytics(true)}
                    leftArrowCallback={this.trackPageChangeAnalytics()}
                    podId={podId}
                    resultId={resultId}
                    totalResults={totalResults}
                >
                    {carouselIsReady && carouselItems}
                </LegacyCarousel>
            </BccBase>
        );
    }
}

const styles = {
    skeleton: {
        title: {
            display: 'inline-block',
            borderRadius: radii.full,
            width: 204
        },
        subhead: {
            display: 'inline-block',
            borderRadius: radii.full,
            width: 102
        },
        item: {
            root: {
                width: '100%'
            },
            imageWrap: {
                marginLeft: 'auto',
                marginRight: 'auto',
                borderRadius: radii[2],
                marginBottom: space[4]
            },
            image: {
                paddingBottom: '100%'
            },
            text: {
                height: space[2],
                marginTop: space[2],
                borderRadius: radii.full
            }
        }
    }
};

export default wrapComponent(BccCarousel, 'BccCarousel', true);
