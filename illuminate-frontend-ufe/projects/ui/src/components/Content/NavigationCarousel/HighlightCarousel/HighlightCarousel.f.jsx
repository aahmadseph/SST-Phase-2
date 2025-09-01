import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import PageCard from 'components/Content/PageCard';
import content from 'constants/content';
import BannerListLayout from 'components/Content/BannerListLayout';
import PAGE_CARD_CONSTS from 'components/Content/PageCard/constants';

const { CONTEXTS } = content;
const { LargeCarousel } = BannerListLayout;

const HighlightCarousel = ({ navigation }) => {
    const { items } = navigation;

    return (
        <LargeCarousel
            context={CONTEXTS.CONTAINER}
            width={PAGE_CARD_CONSTS.CAROUSEL_DIMENSIONS.SMUI.WIDTH}
            largeWidth={PAGE_CARD_CONSTS.CAROUSEL_DIMENSIONS.LGUI.WIDTH}
            marginTop={0}
            marginBottom={0}
            shadowPadding
            gap='medium'
            banners={
                items &&
                items.map((item, itemIndex) => (
                    <PageCard
                        key={`Directory_Navigation_carousel_item_${itemIndex.toString()}`}
                        sid={item.sid}
                        media={item.media}
                        label={item.label}
                        description={item.description}
                        action={item.action}
                        pageLayout={item.action?.page?.layout?.type || ''}
                        variant={PAGE_CARD_CONSTS.VARIANTS.CAROUSEL}
                    />
                ))
            }
        />
    );
};

HighlightCarousel.propTypes = {
    navigation: PropTypes.object.isRequired,
    pageType: PropTypes.string
};

export default wrapFunctionalComponent(HighlightCarousel, 'HighlightCarousel');
