import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import RecapGrid from 'components/Content/Recap/RecapGrid/RecapGrid';
import RecapItem from 'components/Content/Recap/RecapItem';

function RecapBeautyRecommendations({ beautyRecommendations, ...props }) {
    return (
        <RecapItem {...props}>
            <RecapGrid skuList={(beautyRecommendations || []).map(sku => sku)} />
        </RecapItem>
    );
}

RecapBeautyRecommendations.propTypes = {
    beautyRecommendations: PropTypes.array
};

export default wrapFunctionalComponent(RecapBeautyRecommendations, 'RecapBeautyRecommendations');
