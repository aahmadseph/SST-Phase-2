import React from 'react';
import { colors } from 'style/config';
import { Box, Flex } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';
import store from 'Store';
import ProductActions from 'actions/ProductActions';
import Filters from 'utils/Filters';

function HistogramChart(props) {
    const barsStructure = {
        1: {
            RatingValue: '1',
            Count: 0
        },
        2: {
            RatingValue: '2',
            Count: 0
        },
        3: {
            RatingValue: '3',
            Count: 0
        },
        4: {
            RatingValue: '4',
            Count: 0
        },
        5: {
            RatingValue: '5',
            Count: 0
        }
    };

    const { ratingDistribution, totalReviewCount, percentage } = props;

    ratingDistribution.forEach(function (element) {
        barsStructure[element.RatingValue].Count = element.Count;
    });

    const RATING = Filters.REVIEW_FILTERS?.rating?.bvName?.toLowerCase();

    return (
        <div>
            {Object.values(barsStructure)
                .reverse()
                .map(item => (
                    <Flex
                        key={item.RatingValue}
                        data-at={Sephora.debug.dataAt('histogram_rating_option')}
                        onClick={() => {
                            store.dispatch(ProductActions.selectReviewFilters({ [RATING]: [item.RatingValue] }));
                        }}
                        alignItems='center'
                        width='100%'
                        height={[25, 28]}
                        fontSize={['xs', 'base']}
                        lineHeight={0}
                        css={{
                            outline: 0,
                            '.no-touch &:hover .Histogram-label': {
                                textDecoration: 'underline',
                                color: colors.gray
                            },
                            '.no-touch &:hover .Histogram-bar': {
                                backgroundColor: colors.gray
                            }
                        }}
                    >
                        <span
                            className='Histogram-label'
                            children={item.RatingValue}
                        />
                        <Box
                            marginLeft={2}
                            borderRadius='full'
                            height={['6px', '7px']}
                            flex={1}
                            backgroundColor='nearWhite'
                        >
                            <Box
                                className='Histogram-bar'
                                backgroundColor='black'
                                borderRadius='full'
                                height='100%'
                                style={{ width: percentage(totalReviewCount, item.Count) + '%' }}
                            />
                        </Box>
                    </Flex>
                ))}
        </div>
    );
}

export default wrapFunctionalComponent(HistogramChart, 'HistogramChart');
