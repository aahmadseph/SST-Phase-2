import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import { space } from 'style/config';
import {
    Grid, Text, Link, Box, Flex
} from 'components/ui';
import LegacyCarousel from 'components/LegacyCarousel/LegacyCarousel';
import RewardItem from 'components/Reward/RewardItem/RewardItem';
import bccUtils from 'utils/BCC';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import processEvent from 'analytics/processEvent';

//I18n
import localeUtils from 'utils/LanguageLocale';

const { IMAGE_SIZES } = bccUtils;

class RewardsCarousel extends BaseClass {
    constructor(props) {
        super(props);
    }

    trackPageChangeAnalytics =
        (nextPage = false) =>
            () => {
                const pageDirecction = nextPage ? 'next' : 'previous';
                const actionLink = 'Carousel :: Navigation';
                const internalCampaign = `product:${this.props.title}:slide:click ${pageDirecction}`;
                const recentEvent = anaUtils.getLastAsyncPageLoadData({
                    pageType: digitalData.page.pageInfo.pageName
                });

                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        actionInfo: actionLink,
                        linkName: actionLink,
                        internalCampaign: internalCampaign,
                        eventStrings: [anaConsts.Event.EVENT_71],
                        ...recentEvent
                    }
                });
            };

    trackViewAllClick = () => {
        const prop55 = `view all:${this.props.title}`;
        digitalData.page.attributes.previousPageData.linkData = prop55;
        anaUtils.setNextPageData({ linkData: prop55 });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/RewardsCarousel/locales', 'RewardsCarousel');

        const isMobile = Sephora.isMobile();
        const isDesktop = Sephora.isDesktop();

        const {
            anchor, items, title, subtitle, secondSubtitle, hasViewAll, analyticsContext, badges, isAnonymous
        } = this.props;

        const imageSize = isMobile ? IMAGE_SIZES[162] : IMAGE_SIZES[135];

        return (
            <div data-at={Sephora.debug.dataAt('product_carousel')}>
                <Box
                    id={anchor}
                    textAlign={[null, 'center']}
                    marginBottom={[6, 7]}
                >
                    <Text
                        is='p'
                        color='gray'
                        fontWeight='bold'
                        fontSize={['base', 'lg']}
                        children={subtitle}
                    />
                    <Grid
                        alignItems='baseline'
                        lineHeight='tight'
                        columns={['1fr auto', '1fr auto 1fr']}
                    >
                        <Box display={['none', 'block']} />
                        <Text
                            is='h2'
                            fontFamily='serif'
                            fontSize={['xl', '2xl']}
                            data-at={Sephora.debug.dataAt('product_carousel_title')}
                            children={title}
                        />
                        <Flex justifyContent='flex-end'>
                            {hasViewAll && (
                                <Link
                                    padding={2}
                                    margin={-2}
                                    arrowDirection='right'
                                    href='/rewards'
                                    onClick={this.trackViewAllClick}
                                    children={getText('viewAll')}
                                />
                            )}
                        </Flex>
                    </Grid>
                    {secondSubtitle && (
                        <div
                            data-at={Sephora.debug.dataAt('product_carousel_second_subtitle')}
                            dangerouslySetInnerHTML={{
                                __html: secondSubtitle.inner
                            }}
                        />
                    )}
                </Box>
                <LegacyCarousel
                    displayCount={isDesktop ? 4 : 2}
                    totalItems={items.length}
                    carouselMaxItems={12}
                    isFlexItem={true}
                    gutter={space[5]}
                    controlHeight={imageSize}
                    showArrows={isDesktop}
                    showTouts={true}
                    rightArrowCallback={this.trackPageChangeAnalytics(true)}
                    leftArrowCallback={this.trackPageChangeAnalytics()}
                >
                    {items.map((product, index) => (
                        <RewardItem
                            position={index}
                            badges={badges}
                            key={product.skuId}
                            useAddToBasket={true}
                            imageSize={imageSize}
                            isAnonymous={isAnonymous}
                            rootContainerName={title}
                            analyticsContext={analyticsContext}
                            isCarousel={true}
                            {...product}
                        />
                    ))}
                </LegacyCarousel>
            </div>
        );
    }
}

export default wrapComponent(RewardsCarousel, 'RewardsCarousel');
