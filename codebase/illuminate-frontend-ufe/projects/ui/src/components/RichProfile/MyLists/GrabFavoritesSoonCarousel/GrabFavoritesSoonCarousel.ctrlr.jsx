import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Grid, Text, Box } from 'components/ui';
import Carousel from 'components/Carousel';
import FavouriteProductCard from 'components/RichProfile/MyLists/FavouriteProductCard';
import { CARD_GAP, CARDS_PER_SLIDE } from 'constants/productCard';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import CountCircle from 'components/CountCircle';
import { PRODUCT_CARD_WIDTH } from 'constants/sharableList';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyLists/GrabFavoritesSoonCarousel/locales', 'GrabFavoritesSoonCarousel');

class GrabFavoritesSoonCarousel extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            skus: props.skuList,
            title: props.titleText
        };
    }

    showSkeleton = () => this.props.showSkeleton || this.state.showSkeleton;

    render() {
        const { skuList } = this.props;

        const { skus, title } = this.state;

        const showSkeleton = this.showSkeleton();

        if (!showSkeleton && !skus) {
            return null;
        }

        return (
            <>
                {(title || showSkeleton) && (
                    <Grid
                        paddingY={4}
                        columns='1fr'
                        lineHeight='tight'
                        gap={3}
                    >
                        <Box
                            display='flex'
                            alignItems='baseline'
                        >
                            <Text
                                is='h2'
                                fontSize={['base', 'md']}
                                fontWeight='bold'
                                marginTop={[0, '8px']}
                                dangerouslySetInnerHTML={{
                                    __html: showSkeleton ? '&nbsp;' : title
                                }}
                            />
                            {skuList.length > 0 && (
                                <CountCircle
                                    aria-label={skuList.length === 1 ? getText('item') : getText('items')}
                                    key={`loveListSkuCount${skuList.length}`}
                                    data-at={Sephora.debug.dataAt('basket_count')}
                                    children={skuList.length}
                                    marginLeft={2}
                                    top={0}
                                    right={0}
                                    position='static'
                                />
                            )}
                        </Box>
                    </Grid>
                )}
                <Carousel
                    isLoading={showSkeleton}
                    gap={CARD_GAP}
                    paddingY={4}
                    marginX={['-container']}
                    scrollPadding={'container'}
                    itemWidth={PRODUCT_CARD_WIDTH}
                    hasShadowHack={true}
                    items={(showSkeleton ? [...Array(CARDS_PER_SLIDE).keys()] : skuList).map((item, index) => (
                        <FavouriteProductCard
                            isSkeleton={showSkeleton}
                            sku={showSkeleton ? {} : item.sku || item}
                            showAddButton={true}
                            showMarketingFlags={true}
                            showLovesButton={true}
                            showRating={true}
                            isCarousel={true}
                            isHorizontal={true}
                            imageSize={[60, 60]}
                            key={index}
                            position={index}
                        />
                    ))}
                />
            </>
        );
    }
}

GrabFavoritesSoonCarousel.propTypes = {
    skuList: PropTypes.array,
    titleText: PropTypes.string
};

export default wrapComponent(GrabFavoritesSoonCarousel, 'GrabFavoritesSoonCarousel', true);
