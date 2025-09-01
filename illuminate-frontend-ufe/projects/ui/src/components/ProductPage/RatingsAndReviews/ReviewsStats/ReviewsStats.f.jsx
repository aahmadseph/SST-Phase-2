import React from 'react';
import {
    Grid, Text, Box, Image, Flex, Divider
} from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import HistogramChart from 'components/ProductPage/RatingsAndReviews/HistogramChart/HistogramChart';
import ProsAndCons from 'components/ProductPage/RatingsAndReviews/ProsAndCons';
import ReviewLegalText from 'components/ProductPage/RatingsAndReviews/Legal/ReviewLegalText';
import TrustMark from 'components/ProductPage/RatingsAndReviews/TrustMark';
import mediaUtils from 'utils/Media';

const { Media } = mediaUtils;
const percentage = (maxValue, actualValue) => Math.round((100 * actualValue) / maxValue);

function ReviewsStats({ sentiments, reviewStatistics, totalReviewCount, showProsAndCons }) {
    const getText = localeUtils.getLocaleResourceFile('components/ProductPage/RatingsAndReviews/ReviewsStats/locales', 'ReviewsStats');
    const prosAndConsEnabled = sentiments && sentiments.length > 0 && Sephora.configurationSettings.prosAndCons && showProsAndCons;
    const isBVTrustMarkEnabled = Sephora.configurationSettings.isBVTrustMarkEnabled;
    const reviewsLegalComponent = isBVTrustMarkEnabled ? <TrustMark /> : <ReviewLegalText />;

    if (!reviewStatistics) {
        return (
            <>
                {reviewsLegalComponent}
                {prosAndConsEnabled && (
                    <>
                        <Divider marginY={4} />
                        <ProsAndCons />
                    </>
                )}
            </>
        );
    }

    const { ratingDistribution, recommendedCount = 0, averageOverallRating = 0 } = reviewStatistics;

    const recommendedPercentage = percentage(totalReviewCount, recommendedCount);
    const reviewsText = isBVTrustMarkEnabled ? `${getText('reviews')}*` : getText('reviews');

    return (
        <Box marginTop={[4, null, 5]}>
            <Grid
                columns={[null, 'minmax(min-content, 420px) auto minmax(360px, 1fr)']}
                gap={[null, 5]}
                marginLeft={!prosAndConsEnabled && [null, null, null, 212]}
                maxWidth={1072}
            >
                <div>
                    <Text
                        is='h3'
                        fontWeight={prosAndConsEnabled && 'bold'}
                        marginBottom={1}
                        display={['none', 'block']}
                        children={getText('summary')}
                    />
                    <Grid
                        columns='minmax(auto, 265px) minmax(min-content, auto)'
                        alignItems='center'
                    >
                        <div>
                            <HistogramChart
                                ratingDistribution={ratingDistribution}
                                totalReviewCount={totalReviewCount}
                                percentage={percentage}
                            />
                        </div>
                        <Box
                            textAlign='center'
                            lineHeight='none'
                        >
                            <Flex
                                justifyContent='center'
                                alignItems='center'
                            >
                                <Text
                                    fontSize={['xl', '2xl']}
                                    children={parseFloat(averageOverallRating).toFixed(1)}
                                />
                                <Image
                                    marginLeft={2}
                                    src='/img/ufe/icons/star.svg'
                                    size={[16, 20]}
                                />
                            </Flex>
                            <Text
                                marginTop={1}
                                display='block'
                                fontSize='sm'
                            >
                                {totalReviewCount.toLocaleString()} {reviewsText}
                            </Text>
                            {recommendedPercentage >= 80 && (
                                <Box marginTop={[5, 6]}>
                                    <Text
                                        fontSize={['xl', '2xl']}
                                        children={`${recommendedPercentage > 100 ? 100 : recommendedPercentage}%`}
                                    />
                                    <Text
                                        marginTop={1}
                                        display='block'
                                        fontSize='sm'
                                    >
                                        {getText('recommended')}
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </div>
                <Box
                    display={['none', 'block']}
                    borderLeft={1}
                    borderColor='divider'
                    marginRight={prosAndConsEnabled && [null, null, 6]}
                />
                {prosAndConsEnabled ? (
                    <>
                        <Media at='xs'>
                            {reviewsLegalComponent}
                            <Divider marginY={4} />
                        </Media>
                        <ProsAndCons />
                    </>
                ) : (
                    <>{reviewsLegalComponent}</>
                )}
            </Grid>
            {prosAndConsEnabled && <Media greaterThan='xs'>{reviewsLegalComponent}</Media>}
        </Box>
    );
}

export default wrapFunctionalComponent(ReviewsStats, 'ReviewsStats');
