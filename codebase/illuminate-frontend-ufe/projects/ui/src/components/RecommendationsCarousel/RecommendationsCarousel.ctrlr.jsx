import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import ProductList from 'components/Content/ProductList';
import { GROUPING } from 'constants/constructorConstants';
import bpRedesignedUtils from 'utils/BeautyPreferencesRedesigned';
import { fontSizes } from 'style/config';

const { transformRecommendationsForCarousel } = bpRedesignedUtils;
class RecommendationsCarousel extends BaseClass {
    constructor(props) {
        super(props);
    }

    render() {
        const { recommendations, error, subtitle } = this.props;

        if (!recommendations || recommendations?.recommendations?.length === 0 || error) {
            return null;
        }

        const customStyles = {
            title: {
                fontSize: fontSizes.base
            },
            subtitle: {
                fontSize: fontSizes.base
            }
        };

        const { podId, displayName } = recommendations || {};
        const transformedData = transformRecommendationsForCarousel(recommendations?.recommendations);

        return (
            <>
                <ProductList
                    skuList={transformedData}
                    title={displayName}
                    subtitle={subtitle}
                    grouping={GROUPING.BP_REDESIGN}
                    podId={podId}
                    resultId={recommendations?.resultId}
                    totalResults={recommendations?.totalNumResults || recommendations?.recommendations?.length || 0}
                    isCarousel={true}
                    customStyles={customStyles}
                    {...this.props}
                />
            </>
        );
    }
}

export default wrapComponent(RecommendationsCarousel, 'RecommendationsCarousel', true);
