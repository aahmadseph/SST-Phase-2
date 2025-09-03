import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import Carousel from 'components/Carousel';
import { modal } from 'style/config';
import {
    CARD_GAP,
    CARD_WIDTH,
    CARD_WIDTH_MD,
    CARD_WIDTH_LARGE,
    CARDS_PER_SLIDE_LARGE,
    CARDS_PER_SLIDE,
    CARDS_PER_SLIDE_MD,
    CARD_IMG_SIZE,
    CARD_IMG_SIZE_MD,
    CARD_IMG_SIZE_LARGE
} from 'constants/productCard';
import ProductCard from 'components/Product/ProductCard';
import constants from 'constants/content';
import anaConsts from 'analytics/constants';
import Empty from 'constants/empty';
import { sendCmsComponentEvent } from 'analytics/utils/cmsComponents';

const {
    COMPONENT_TYPES: { PRODUCT_LIST }
} = constants;

const {
    CMS_COMPONENT_EVENTS: { IMPRESSION, ITEM_CLICK }
} = anaConsts;

const CardSizes = {
    small: {
        cardWidth: CARD_WIDTH,
        cardsPerSlide: CARDS_PER_SLIDE,
        imageSize: CARD_IMG_SIZE
    },
    large: {
        cardWidth: CARD_WIDTH_LARGE,
        cardsPerSlide: CARDS_PER_SLIDE_LARGE,
        imageSize: CARD_IMG_SIZE_LARGE
    },
    horizontal: {
        cardWidth: CARD_WIDTH_MD,
        cardsPerSlide: CARDS_PER_SLIDE_MD,
        imageSize: CARD_IMG_SIZE_MD
    }
};

const CarouselLayout = props => {
    const {
        sid,
        showSkeleton,
        isModal,
        title,
        showMarketingFlags,
        showRankingNumbers,
        showLovesButton,
        showRatingWithCount,
        showQuickLookOnMobile,
        ignoreTargetUrlForBox,
        skus,
        showPrice,
        showAddButton,
        renderBiButton,
        size,
        customCardSize,
        podId,
        componentType,
        showErrorModal,
        analyticsContext,
        rootContainerName,
        rougeBadgeText,
        hideShadowsCover,
        resultId,
        totalResults,
        defaultRewardBiButton,
        gap = CARD_GAP,
        scrollPadding
    } = props;
    const component = componentType ? componentType : PRODUCT_LIST;

    const sizeConfig = Object.assign(CardSizes[size], customCardSize);

    const triggerImpression = function (targets) {
        const currentItems = [];

        skus?.forEach((_, index) => {
            if (targets.includes(index)) {
                currentItems.push({
                    ...skus[index],
                    itemIndex: index
                });
            }
        });

        sendCmsComponentEvent({
            items: currentItems,
            eventName: IMPRESSION,
            title,
            sid,
            component
        });
    };

    const triggerClick = function (target, position) {
        sendCmsComponentEvent({
            items: [{ ...target, itemIndex: position }],
            eventName: ITEM_CLICK,
            title,
            sid,
            component
        });
    };

    return (
        <Carousel
            id={sid}
            isModal={isModal}
            podId={podId}
            resultId={resultId}
            totalResults={totalResults}
            isLoading={!!showSkeleton}
            gap={gap}
            paddingY={4}
            marginX={isModal ? modal.outdentX : '-container'}
            scrollPadding={scrollPadding ? scrollPadding : [2, isModal ? modal.paddingX[1] : 'container']}
            itemWidth={sizeConfig.cardWidth}
            hasShadowHack={hideShadowsCover ? false : !isModal}
            title={title}
            onImpression={triggerImpression}
            items={(showSkeleton ? [...Array(sizeConfig.cardsPerSlide).keys()] : skus).map((item, index) => (
                <ProductCard
                    key={item.sku || index}
                    position={index}
                    isSkeleton={showSkeleton}
                    sku={showSkeleton ? {} : item.sku || item}
                    showPrice={showPrice}
                    showAddButton={renderBiButton || showAddButton}
                    defaultRewardBiButton={defaultRewardBiButton}
                    useInternalTracking={true}
                    componentName={sid}
                    parentTitle={title}
                    showMarketingFlags={showMarketingFlags}
                    rank={showRankingNumbers ? index + 1 : null}
                    showLovesButton={showLovesButton}
                    showRating={showRatingWithCount}
                    imageSize={sizeConfig.imageSize}
                    showQuickLookOnMobile={showQuickLookOnMobile}
                    ignoreTargetUrlForBox={ignoreTargetUrlForBox}
                    podId={podId}
                    isHorizontal={size === 'horizontal'}
                    triggerCmsEvent={sku => {
                        triggerClick(sku, index);
                    }}
                    showErrorModal={showErrorModal}
                    analyticsContext={analyticsContext}
                    rootContainerName={rootContainerName}
                    rougeBadgeText={rougeBadgeText}
                    parentType={component}
                    isCarousel={true}
                />
            ))}
        />
    );
};

CarouselLayout.propTypes = {
    sid: PropTypes.string,
    showSkeleton: PropTypes.bool,
    title: PropTypes.string,
    showMarketingFlags: PropTypes.bool,
    showRankingNumbers: PropTypes.bool,
    showLovesButton: PropTypes.bool,
    showRatingWithCount: PropTypes.bool,
    showQuickLookOnMobile: PropTypes.bool,
    ignoreTargetUrlForBox: PropTypes.bool,
    skus: PropTypes.array,
    showPrice: PropTypes.bool,
    showAddButton: PropTypes.bool,
    renderBiButton: PropTypes.func,
    defaultRewardBiButton: PropTypes.func,
    size: PropTypes.oneOf(Object.keys(CardSizes)),
    showErrorModal: PropTypes.bool
};

CarouselLayout.defaultProps = {
    sid: null,
    size: 'small',
    showErrorModal: false,
    customCardSize: Empty.Object
};

export default wrapFunctionalComponent(CarouselLayout, 'CarouselLayout');
