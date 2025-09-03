import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { modal, radii } from 'style/config';
import { Grid, Text, Link } from 'components/ui';
import Carousel from 'components/Carousel';
import ProductCard from 'components/Product/ProductCard';
import { CARD_GAP, CARD_WIDTH, CARDS_PER_SLIDE } from 'constants/productCard';
import Location from 'utils/Location';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import UiUtils from 'utils/UI';
import UrlUtils from 'utils/Url';
import anaUtils from 'analytics/utils';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const { SKELETON_ANIMATION } = UiUtils;
const { getLink, addInternalTracking } = UrlUtils;
const getText = getLocaleResourceFile('components/Bcc/BccRwdProductList/locales', 'BccRwdProductList');

class BccRwdProductList extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            skus: props.skuList,
            title: props.titleText,
            targetUrl: props.showMoreUrl
        };
    }

    showSkeleton = () => this.props.showSkeleton || this.state.showSkeleton;

    render() {
        const {
            name,
            showAddButton,
            showPrice,
            showMarketingFlags,
            showRankingNumbers,
            showLovesButton,
            showRatingWithCount,
            showMoreText,
            enablePageRenderTracking,
            displayCount,
            showQuickLookOnMobile,
            page,
            ignoreTargetUrlForBox,
            context
        } = this.props;

        const { skus, title, targetUrl } = this.state;

        const showSkeleton = this.showSkeleton();

        if (!showSkeleton && !skus) {
            return null;
        }

        const showMoreUrlWithTracking = targetUrl?.indexOf('icid2=') === -1 ? addInternalTracking(targetUrl, [name]) : targetUrl;
        const isModal = context === 'modal';

        return (
            <>
                {(title || showSkeleton) && (
                    <Grid
                        alignItems='baseline'
                        columns='1fr auto'
                        lineHeight='tight'
                        gap={3}
                    >
                        <Text
                            is='h2'
                            marginBottom={4}
                            fontSize={['md', 'lg']}
                            fontWeight='bold'
                            css={showSkeleton && [styles.skeleton.title, SKELETON_ANIMATION]}
                            dangerouslySetInnerHTML={{
                                __html: showSkeleton ? '&nbsp;' : title
                            }}
                        />
                        {showMoreUrlWithTracking && !showSkeleton && (
                            <Link
                                padding={2}
                                margin={-2}
                                color='blue'
                                href={getLink(showMoreUrlWithTracking)}
                                onClick={e => {
                                    if (page === 'home') {
                                        const linkData = 'reward bazaar:carousel:view all';
                                        anaUtils.setNextPageData({
                                            linkData: linkData,
                                            internalCampaign: linkData
                                        });
                                    }

                                    Location.navigateTo(e, showMoreUrlWithTracking);
                                }}
                                children={showMoreText || getText('showMore')}
                            />
                        )}
                    </Grid>
                )}
                {showSkeleton || this.props.renderSubHeader?.()}
                <Carousel
                    isLoading={showSkeleton}
                    gap={CARD_GAP}
                    paddingY={4}
                    marginX={isModal ? modal.outdentX : '-container'}
                    scrollPadding={[2, isModal ? [2, modal.paddingX[1]] : 'container']}
                    itemWidth={CARD_WIDTH}
                    hasShadowHack={true}
                    items={(showSkeleton ? [...Array(CARDS_PER_SLIDE).keys()] : skus).map((item, index) => (
                        <ProductCard
                            isSkeleton={showSkeleton}
                            isPageRenderImg={enablePageRenderTracking && index < displayCount}
                            sku={showSkeleton ? {} : item.sku || item}
                            showPrice={showPrice}
                            showAddButton={this.props.renderBiButton || showAddButton}
                            useInternalTracking={true}
                            parentTitle={title}
                            showMarketingFlags={showMarketingFlags}
                            rank={showRankingNumbers ? index + 1 : null}
                            showLovesButton={showLovesButton}
                            showRating={showRatingWithCount}
                            imageSize={160}
                            showQuickLookOnMobile={showQuickLookOnMobile}
                            ignoreTargetUrlForBox={ignoreTargetUrlForBox}
                            componentName={name}
                            isCarousel={true}
                        />
                    ))}
                />
            </>
        );
    }
}

const styles = {
    skeleton: {
        title: {
            borderRadius: radii.full,
            width: 204
        }
    }
};

BccRwdProductList.propTypes = {
    componentName: PropTypes.string,
    componentType: PropTypes.number,
    context: PropTypes.oneOf(['container', 'modal', 'inline']),
    displayCount: PropTypes.number,
    enablePageRenderTracking: PropTypes.bool,
    enableTesting: PropTypes.bool,
    name: PropTypes.string,
    page: PropTypes.string,
    showAddButton: PropTypes.bool,
    showLovesButton: PropTypes.bool,
    showMarketingFlags: PropTypes.bool,
    showRankingNumbers: PropTypes.bool,
    showMoreText: PropTypes.string,
    showMoreUrl: PropTypes.string,
    showPrice: PropTypes.bool,
    showRatingWithCount: PropTypes.bool,
    skuList: PropTypes.array,
    style: PropTypes.object,
    titleText: PropTypes.string,
    showQuickLookOnMobile: PropTypes.bool
};

BccRwdProductList.defaultProps = {
    enablePageRenderTracking: false,
    showQuickLookOnMobile: false
};

export default wrapComponent(BccRwdProductList, 'BccRwdProductList', true);
