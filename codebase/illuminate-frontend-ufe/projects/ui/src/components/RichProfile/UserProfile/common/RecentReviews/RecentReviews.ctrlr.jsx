/* eslint-disable max-len */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { space } from 'style/config';
import { Box, Text } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import Ellipsis from 'components/Ellipsis/Ellipsis';
import StarRating from 'components/StarRating/StarRating';
import bccUtils from 'utils/BCC';
import SectionContainer from 'components/RichProfile/UserProfile/common/SectionContainer/SectionContainer';
import localeUtils from 'utils/LanguageLocale';
import { supplementAltTextWithProduct } from 'utils/Accessibility';
import snbApi from 'services/api/search-n-browse';

const { IMAGE_SIZES } = bccUtils;
const { getLocaleResourceFile } = localeUtils;
const REVIEW_DISPLAY_LIMIT = 2;

class RecentReviews extends BaseClass {
    state = {
        reviewsData: null
    };

    componentDidMount() {
        const reviewsDataPromises = this.props.reviews.slice(0, REVIEW_DISPLAY_LIMIT).map(review =>
            snbApi
                .getProductDetails(review.productId, review.skuId, { addCurrentSkuToProductChildSkus: true })
                .then(product => ({
                    review,
                    product
                }))
                .catch(e => {
                    console.log(e); // eslint-disable-line no-console
                })
        );

        // (!) Failure of any request would result in failure to render page.
        // TODO Address this concern.

        Promise.all(reviewsDataPromises).then(reviewsData => {
            this.setState({ reviewsData });
        });
    }

    render() {
        const getText = getLocaleResourceFile('components/RichProfile/UserProfile/common/RecentReviews/locales', 'RecentReviews');
        const { isMyProfile, nickname, profileId } = this.props;

        const isMobile = Sephora.isMobile();

        const reviewsData = this.state.reviewsData;

        const userAllReviewsUrl = Sephora.configurationSettings.bvUserAllReviewsUrl + `${profileId}/profile.htm`;

        return (
            <SectionContainer
                hasDivider={true}
                title={getText(isMyProfile ? 'myRecentReviews' : 'recentReviews')}
                link={userAllReviewsUrl}
            >
                <LegacyGrid gutter={!isMobile ? 5 : null}>
                    {reviewsData &&
                        reviewsData.map(
                            data =>
                                data && (
                                    //revisit this
                                    <LegacyGrid.Cell
                                        key={data.product.commerceId}
                                        width={!isMobile ? '50%' : null}
                                    >
                                        <Box
                                            href={data.product.targetUrl}
                                            lineHeight='tight'
                                            css={
                                                !isMobile
                                                    ? {
                                                        boxShadow: '0 0 5px 0 rgba(0,0,0,0.15)',
                                                        padding: space[4]
                                                    }
                                                    : {}
                                            }
                                        >
                                            <LegacyGrid
                                                gutter={isMobile ? 4 : 5}
                                                marginBottom={3}
                                            >
                                                <LegacyGrid.Cell width='fit'>
                                                    <ProductImage
                                                        id={data.product.currentSku.skuId}
                                                        size={isMobile ? IMAGE_SIZES[97] : IMAGE_SIZES[162]}
                                                        skuImages={data.product.currentSku.skuImages}
                                                        altText={supplementAltTextWithProduct(data.product.currentSku, data.product)}
                                                    />
                                                </LegacyGrid.Cell>
                                                <LegacyGrid.Cell width='fill'>
                                                    <Text
                                                        display='block'
                                                        fontWeight='bold'
                                                    >
                                                        {data.product.brand && data.product.brand.displayName}
                                                    </Text>
                                                    <Text>{data.product.displayName}</Text>
                                                    <Box marginTop={4}>
                                                        <Box
                                                            display='inline-block'
                                                            fontSize={isMobile ? 'md' : 'lg'}
                                                            marginRight='.5em'
                                                            verticalAlign='text-bottom'
                                                        >
                                                            <StarRating rating={data.review.rating} />
                                                        </Box>
                                                        <Text>({getText(isMyProfile ? 'userRating' : 'nicknameRating', [nickname])})</Text>
                                                    </Box>
                                                </LegacyGrid.Cell>
                                            </LegacyGrid>
                                            <Text
                                                is='h4'
                                                fontSize='md'
                                                fontWeight='bold'
                                                marginBottom={1}
                                            >
                                                {data.review.title}
                                            </Text>
                                            <Ellipsis
                                                lineHeight='tight'
                                                overflowText={getText('readMore')}
                                                isLink={true}
                                                numberOfLines={4}
                                                children={data.review.reviewText}
                                            />
                                        </Box>
                                    </LegacyGrid.Cell>
                                )
                        )}
                </LegacyGrid>
            </SectionContainer>
        );
    }
}

export default wrapComponent(RecentReviews, 'RecentReviews', true);
