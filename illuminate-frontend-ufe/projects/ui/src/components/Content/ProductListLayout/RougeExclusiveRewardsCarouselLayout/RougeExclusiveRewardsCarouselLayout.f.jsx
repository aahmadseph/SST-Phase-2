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
import anaConstants from 'analytics/constants';

const {
    COMPONENT_TYPES: { PRODUCT_LIST }
} = constants;

const {
    CMS_COMPONENT_EVENTS: { ITEM_CLICK }
} = anaConsts;

import { mountCmsComponentEventData, shouldSentEvent } from 'analytics/utils/cmsComponents';

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

const RougeExclusiveRewardsCarouselLayout = props => {
    const {
        showSkeleton = false,
        isModal = false,
        title,
        showMarketingFlags = false,
        showRankingNumbers = false,
        showLovesButton = false,
        showRatingWithCount = false,
        showQuickLookOnMobile = false,
        skus,
        showPrice = false,
        size,
        customCardSize = 20,
        showErrorModal = false,
        rougeBadgeText,
        analyticsContext,
        defaultRewardBiButton
    } = props;
    const component = PRODUCT_LIST;
    const sizeConfig = Object.assign(CardSizes[size], customCardSize);

    const triggerClick = function (target) {
        const eventData = mountCmsComponentEventData({
            items: [target],
            eventName: ITEM_CLICK,
            title,
            component
        });

        shouldSentEvent(eventData);
    };

    return (
        <Carousel
            isModal={isModal}
            isLoading={showSkeleton}
            gap={CARD_GAP}
            paddingY={4}
            marginX={isModal ? modal.outdentX : '-container'}
            scrollPadding={[2, isModal ? modal.paddingX[1] : 'container']}
            itemWidth={sizeConfig.cardWidth}
            hasShadowHack={!isModal}
            title={title}
            items={skus.map((item, index) => (
                <ProductCard
                    key={item.sku || index}
                    position={index}
                    isSkeleton={showSkeleton}
                    sku={showSkeleton ? {} : item.sku || item}
                    showPrice={showPrice}
                    showAddButton={true}
                    defaultRewardBiButton={defaultRewardBiButton}
                    useInternalTracking={true}
                    parentTitle={anaConstants.CAROUSEL_NAMES.ROUGE_REWARDS_CAROUSEL}
                    showMarketingFlags={showMarketingFlags}
                    rank={showRankingNumbers ? index + 1 : null}
                    showLovesButton={showLovesButton}
                    showRating={showRatingWithCount}
                    imageSize={sizeConfig.imageSize}
                    showQuickLookOnMobile={showQuickLookOnMobile}
                    isHorizontal={size === 'horizontal'}
                    triggerCmsEvent={triggerClick}
                    showErrorModal={showErrorModal}
                    ctaTwoLines={false}
                    rougeBadgeText={rougeBadgeText}
                    analyticsContext={analyticsContext}
                    isRougeExclusiveCarousel={true}
                    rootContainerName={anaConstants.CAROUSEL_NAMES.ROUGE_REWARDS_CAROUSEL}
                    isRewardItem={true}
                    isCarousel={true}
                />
            ))}
        />
    );
};

RougeExclusiveRewardsCarouselLayout.propTypes = {
    showSkeleton: PropTypes.bool,
    title: PropTypes.string,
    showMarketingFlags: PropTypes.bool,
    showRankingNumbers: PropTypes.bool,
    showLovesButton: PropTypes.bool,
    showRatingWithCount: PropTypes.bool,
    showQuickLookOnMobile: PropTypes.bool,
    skus: PropTypes.array,
    showPrice: PropTypes.bool,
    showAddButton: PropTypes.bool,
    size: PropTypes.oneOf(Object.keys(CardSizes)),
    showErrorModal: PropTypes.bool,
    defaultRewardBiButton: PropTypes.func
};

RougeExclusiveRewardsCarouselLayout.defaultProps = {
    sid: null,
    size: 'small',
    showErrorModal: false,
    customCardSize: Empty.Object
};

export default wrapFunctionalComponent(RougeExclusiveRewardsCarouselLayout, 'RougeExclusiveRewardsCarouselLayout');
