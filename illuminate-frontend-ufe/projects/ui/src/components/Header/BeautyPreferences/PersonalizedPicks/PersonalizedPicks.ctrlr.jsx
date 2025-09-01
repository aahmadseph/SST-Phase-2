/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import ProductCard from 'components/Product/ProductCard/ProductCard';
import { Text, Box } from 'components/ui';
import Carousel from 'components/Carousel';
import { placeholderSkus } from 'constants/beautyPreferences';
import { CARD_GAP, CARD_WIDTH, CARD_IMG_SIZE } from 'constants/productCard';
import ConstructorCarousel from 'components/ConstructorCarousel';
import { CONSTRUCTOR_PODS, GROUPING } from 'constants/constructorConstants';
import BeautyPreferencesUtils from 'utils/BeautyPreferences';

const { mapBeautyPreferencesToConstructorValues } = BeautyPreferencesUtils;

class PersonalizedPicks extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            beautyPreferencesFilter: null,
            showBlurryCarousel: true
        };
    }

    showBlurryCarousel = () => {
        this.setState({ showBlurryCarousel: true });
    };

    setBeautyPreferencesFilter(beautyPreferences) {
        const beautyPerferencesUpdatedValue = mapBeautyPreferencesToConstructorValues(beautyPreferences);

        if (beautyPerferencesUpdatedValue) {
            this.setState({ beautyPreferencesFilter: beautyPerferencesUpdatedValue, showBlurryCarousel: false });
        } else {
            this.showBlurryCarousel();
        }
    }

    updateCarousel = () => {
        const { beautyPreferences, isMinRequiredTraits } = this.props;

        if (isMinRequiredTraits) {
            this.setBeautyPreferencesFilter(beautyPreferences);
        } else {
            this.showBlurryCarousel();
        }
    };

    componentDidMount() {
        this.updateCarousel();
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps.beautyPreferences) !== JSON.stringify(this.props.beautyPreferences)) {
            this.updateCarousel();
        }
    }

    render() {
        const { subTitle, blurryCarouselTitle } = this.props;

        const cards = placeholderSkus.map(item => (
            <ProductCard
                isSkeleton={false}
                key={item.sku_id || item.skuId}
                sku={item}
                imageSize={CARD_IMG_SIZE}
                showLovesButton={true}
            />
        ));

        return this.state.showBlurryCarousel ? (
            <div id='personalized-picks'>
                <Box
                    lineHeight='tight'
                    marginY={4}
                >
                    <Text
                        is='h2'
                        fontSize={[null, null, 'lg']}
                        fontWeight='bold'
                        marginBottom='.25em'
                    >
                        <span>{blurryCarouselTitle}</span>
                    </Text>
                    <p>
                        <span>{subTitle}</span>
                    </p>
                </Box>
                <div
                    aria-hidden={'true'}
                    inert={'true'}
                    css={styles.blur}
                >
                    <Carousel
                        isLoading={true}
                        gap={CARD_GAP}
                        paddingY={4}
                        marginX='-container'
                        scrollPadding={[2, 'container']}
                        itemWidth={CARD_WIDTH}
                        items={cards}
                        hasShadowHack={true}
                    />
                    <Box
                        position='absolute'
                        top={2}
                        right={2}
                        bottom={2}
                        left={2}
                        backgroundColor='nearWhite'
                        borderRadius={3}
                        marginX='-container'
                        css={{ mixBlendMode: 'multiply' }}
                    />
                </div>
            </div>
        ) : (
            <div id='personalized-picks'>
                <ConstructorCarousel
                    podId={CONSTRUCTOR_PODS.PERSONALIZED_PICKS}
                    params={{
                        preFilterExpression: this.state.beautyPreferencesFilter
                    }}
                    subtitle={subTitle}
                    grouping={GROUPING.PERSONALIZED_PICKS}
                    formatValuePrice={true}
                    onConstructorFailed={this.showBlurryCarousel}
                />
            </div>
        );
    }
}

const styles = {
    blur: {
        position: 'relative',
        filter: 'blur(3px)',
        pointerEvents: 'none'
    }
};

export default wrapComponent(PersonalizedPicks, 'PersonalizedPicks', true);
