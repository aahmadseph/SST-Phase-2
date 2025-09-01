import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'Store';
import { modal, radii } from 'style/config';
import { Grid, Link, Text } from 'components/ui';
import Carousel from 'components/Carousel';
import BccRwdPromoItem from 'components/Bcc/BccRwdPromoList/BccRwdPromoItem';
import UiUtils from 'utils/UI';
import Location from 'utils/Location';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import anaUtils from 'analytics/utils';
import { CARD_GAP, CARD_WIDTH, CARDS_PER_SLIDE } from 'constants/promotionCard';

const { SKELETON_ANIMATION } = UiUtils;
const { getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/Bcc/BccRwdPromoList/locales', 'BccRwdPromoItem');
const OFFERS_URL = '/beauty/beauty-offers';

class BccRwdPromoList extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            appliedPromos: []
        };
    }

    componentDidMount() {
        store.setAndWatch('basket', this, value => {
            this.setState({
                appliedPromos: value.basket.appliedPromotions
            });
        });
    }

    render() {
        const {
            offerCategoryTitle,
            componentList = [],
            context,
            enablePageRenderTracking = false,
            displayCount,
            showSkeleton,
            page,
            isPersonalizedBeautyOffers
        } = this.props;

        if (!showSkeleton && componentList.length === 0) {
            return null;
        }

        const isModal = context === 'modal';

        const items = showSkeleton ? [...Array(CARDS_PER_SLIDE).keys()] : componentList;
        const cards = items.map((promo, index) => (
            <BccRwdPromoItem
                {...(showSkeleton
                    ? {
                        isSkeleton: true,
                        promo: {}
                    }
                    : {
                        promo,
                        isPageRenderImg: enablePageRenderTracking && index < displayCount,
                        isApplied: this.state.appliedPromos.some(e => e.couponCode === promo.promoCode?.toLowerCase()),
                        offerCategoryTitle,
                        isPersonalizedBeautyOffers
                    })}
            />
        ));

        const showViewAllLink = !Location.isOffersPage() && !(Sephora.configurationSettings.isContentfulBasketEnabled && Location.isBasketPage());

        return (
            <>
                {(offerCategoryTitle || showSkeleton) && (
                    <Grid
                        columns={showViewAllLink && '1fr auto'}
                        alignItems='baseline'
                    >
                        <Text
                            is='h2'
                            marginBottom={4}
                            fontSize={['md', 'lg']}
                            fontWeight='bold'
                            css={showSkeleton && [styles.skeleton.title, SKELETON_ANIMATION]}
                            dangerouslySetInnerHTML={{
                                __html: showSkeleton ? '&nbsp;' : `${offerCategoryTitle} (${cards.length})`
                            }}
                        />
                        {showViewAllLink && !showSkeleton && (
                            <Link
                                href={OFFERS_URL}
                                onClick={e => {
                                    if (page === 'home') {
                                        const linkData = 'beauty offer:carousel:view all';
                                        anaUtils.setNextPageData({
                                            linkData: linkData,
                                            internalCampaign: linkData
                                        });
                                    }

                                    Location.navigateTo(e, OFFERS_URL);
                                }}
                                color='blue'
                                padding={1}
                                margin={-1}
                                children={getText('viewAll')}
                            />
                        )}
                    </Grid>
                )}
                <Carousel
                    gap={CARD_GAP}
                    paddingY={4}
                    marginX={isModal ? modal.outdentX : '-container'}
                    scrollPadding={[2, isModal ? [2, modal.paddingX[1]] : 'container']}
                    itemWidth={CARD_WIDTH}
                    items={cards}
                    hasShadowHack={true}
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

export default wrapComponent(BccRwdPromoList, 'BccRwdPromoList', true);
