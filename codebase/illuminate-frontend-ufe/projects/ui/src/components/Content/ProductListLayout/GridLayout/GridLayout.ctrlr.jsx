import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { mediaQueries } from 'style/config';
import { Grid } from 'components/ui';
import {
    CARD_GAP_GRID, CARD_IMG_SIZE_GRID, CARD_IMG_SIZE_GRID_LARGE, CARD_IMG_SIZE_GRID_X_LARGE
} from 'constants/productCard';
import ProductCard from 'components/Product/ProductCard';
import constants from 'constants/content';
import CmsComponentEvents from 'analytics/utils/cmsComponentEvents';

const {
    COMPONENT_TYPES: { PRODUCT_LIST }
} = constants;

const COLUMNS = {
    small: 5,
    large: 4,
    xlarge: 4
};

const CardSizes = {
    small: {
        imageSize: CARD_IMG_SIZE_GRID
    },
    large: {
        imageSize: CARD_IMG_SIZE_GRID_LARGE
    },
    xlarge: {
        imageSize: CARD_IMG_SIZE_GRID_X_LARGE
    }
};

class GridLayout extends BaseClass {
    constructor(props) {
        super(props);
        this.elementRef = React.createRef();
        this.tracker = null;
    }

    componentDidMount() {
        if (this.elementRef?.current) {
            const { title, sid, componentType } = this.props;
            const component = componentType ? componentType : PRODUCT_LIST;

            const tracker = new CmsComponentEvents({
                callback: () => this.triggerImpression(),
                eventData: {
                    component,
                    title,
                    sid
                }
            });

            tracker.observe(this.elementRef.current);

            this.tracker = tracker;
        }
    }

    componentWillUnmount() {
        this.tracker.destroy();
    }

    triggerImpression() {
        const { skus } = this.props;

        const currentItems = skus?.map((_, index) => {
            return {
                ...skus[index],
                itemIndex: index
            };
        });

        this.tracker.sendEvent({
            items: currentItems
        });
    }

    triggerClick(target, position) {
        this.tracker.sendEvent(
            {
                items: [{ ...target, itemIndex: position }]
            },
            true
        );
    }

    render() {
        const {
            sid,
            showSkeleton,
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
            defaultRewardBiButton,
            size,
            isBIRBReward,
            isAnonymous,
            isShowAddFullSize,
            isInBasket,
            rougeBadgeText,
            isSharableList = false,
            forceDisplayRating = false,
            showVariationTypeAndValue = false,
            invertPriceAndRatingOrder = false,
            gap,
            customCSS,
            analyticsContext
        } = this.props;

        const numberOfColumns = COLUMNS[size];
        const sizeConfig = CardSizes[size];

        return (
            <Grid
                id={sid}
                css={styles.contained(numberOfColumns)}
                ref={this.elementRef}
                gap={gap}
            >
                {(showSkeleton ? [...Array(numberOfColumns).keys()] : skus).map((item, index) => (
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
                        outline={'none'}
                        isBIRBReward={isBIRBReward}
                        isAnonymous={isAnonymous}
                        isShowAddFullSize={isShowAddFullSize}
                        isInBasket={isInBasket}
                        rougeBadgeText={rougeBadgeText}
                        triggerCmsEvent={sku => {
                            this.triggerClick(sku, index);
                        }}
                        isCarousel={true}
                        isSharableList={isSharableList}
                        forceDisplayRating={forceDisplayRating}
                        listNames={item.listNames || []}
                        showVariationTypeAndValue={showVariationTypeAndValue}
                        invertPriceAndRatingOrder={invertPriceAndRatingOrder}
                        customCSS={customCSS}
                        analyticsContext={analyticsContext}
                    />
                ))}
            </Grid>
        );
    }
}

const styles = {
    contained: columns => ({
        position: 'relative',
        width: '100%',
        padding: 0,
        paddingLeft: '-15px',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        [mediaQueries.xsMax]: {
            gridTemplateColumns: '1fr 1fr'
        }
    })
};

GridLayout.propTypes = {
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
    isSharableList: PropTypes.bool
};

GridLayout.defaultProps = {
    sid: null,
    size: 'small',
    isSharableList: false,
    gap: CARD_GAP_GRID,
    analyticsContext: null
};

export default wrapComponent(GridLayout, 'GridLayout', true);
