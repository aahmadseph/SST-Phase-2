/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import SectionContainer from 'components/RichProfile/UserProfile/common/SectionContainer/SectionContainer';
import ConstructorCarousel from 'components/ConstructorCarousel';
import { CONSTRUCTOR_PODS } from 'constants/constructorConstants';
import bccUtils from 'utils/BCC';

const { COMPONENT_NAMES, IMAGE_SIZES } = bccUtils;
const IMAGE_SIZE = IMAGE_SIZES[135];
const isMobile = Sephora.isMobile();

class ProductRecommendations extends BaseClass {
    render() {
        return (
            <SectionContainer
                isMyProfile
                hasDivider
            >
                <div>
                    <ConstructorCarousel
                        showPrice
                        showReviews={true}
                        showLoves
                        skuImageSize={IMAGE_SIZE}
                        showTouts
                        showArrows
                        displayCount={isMobile ? 2 : 4}
                        showMarketingFlags
                        componentType={COMPONENT_NAMES.CAROUSEL}
                        data-at={Sephora.debug.dataAt('product_carousel_title')}
                        formatValuePrice={true}
                        podId={CONSTRUCTOR_PODS.COMMUNITY_PROFILE}
                    />
                </div>
            </SectionContainer>
        );
    }
}

export default wrapComponent(ProductRecommendations, 'ProductRecommendations');
