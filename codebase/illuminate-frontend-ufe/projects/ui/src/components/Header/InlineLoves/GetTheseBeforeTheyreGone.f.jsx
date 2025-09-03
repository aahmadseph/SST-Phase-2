import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import Carousel from 'components/Carousel';
import ProductCard from 'components/Product/ProductCard';
import { fontSizes } from 'style/config';
import anaConsts from 'analytics/constants';
const {
    PAGE_TYPES: { USER_PROFILE, MY_LISTS_FLYOUT },
    PAGE_NAMES: { MY_LISTS }
} = anaConsts;
const GetTheseBeforeTheyreGone = ({ skus, arrowWidth, arrowCircleWidth }) => {
    return (
        <Carousel
            gap={3}
            paddingY={4}
            marginX={0}
            paddingX={1}
            arrowWidth={arrowWidth}
            arrowCircleWidth={arrowCircleWidth}
            scrollPadding={'container'}
            itemWidth={'295px'}
            hasShadowHack={true}
            showArrowOnHover={true}
            minHeight={0}
            outdent={-16}
            items={skus.map(({ sku }) => (
                <ProductCard
                    sku={sku}
                    showPrice={true}
                    showAddButton={true}
                    showLovesButton={true}
                    imageSize={'60px'}
                    showRating={true}
                    forceDisplayRating={true}
                    hideQuicklook={true}
                    loveButtonPosition={['bottom', 'right']}
                    verticalPos={'14px'}
                    horizontalPos={'45px'}
                    isHorizontal={true}
                    labelFontSize={fontSizes.sm}
                    isSharableList={true}
                    showMarketingFlags={false}
                    showOnlyFewLeft={true}
                    isInCarousel={true}
                    customCSS={syle.customCSS}
                    analyticsContext={MY_LISTS}
                    pageName={`${USER_PROFILE}:${MY_LISTS}:${MY_LISTS_FLYOUT}:*`}
                ></ProductCard>
            ))}
        />
    );
};

const syle = {
    customCSS: {
        onlyAFewFlag: {
            textOverflow: 'ellipsis',
            maxWidth: '140%',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
        }
    }
};

GetTheseBeforeTheyreGone.propTypes = {
    skus: PropTypes.array,
    // Max number of product thumbnails to show in each chunklet
    thumbnails: PropTypes.number,
    // Width (in pixels) of the navigation arrows inside the circle used to go navigate the slides
    arrowWidth: PropTypes.number,
    // Width (in pixels) of the circle that contains the navigation arrows
    arrowCircleWidth: PropTypes.number
};

GetTheseBeforeTheyreGone.defaultProps = {
    skus: [],
    thumbnails: 3,
    arrowWidth: 10,
    arrowCircleWidth: 32
};

export default wrapFunctionalComponent(GetTheseBeforeTheyreGone, 'GetTheseBeforeTheyreGone');
