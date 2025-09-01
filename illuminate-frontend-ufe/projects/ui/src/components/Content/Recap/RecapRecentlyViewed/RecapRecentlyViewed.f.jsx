import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import RecapItem from 'components/Content/Recap/RecapItem';
import RecapImage from 'components/Content/Recap/RecapImage';

function RecapRecentlyViewed({ sku, showImage, ...props }) {
    return (
        <RecapItem {...props}>
            {showImage && (
                <RecapImage
                    sku={sku}
                    isSingle={true}
                />
            )}
        </RecapItem>
    );
}

RecapRecentlyViewed.propTypes = {
    sku: PropTypes.object,
    showImage: PropTypes.bool.isRequired
};

RecapRecentlyViewed.defaultProps = {
    sku: {}
};

export default wrapFunctionalComponent(RecapRecentlyViewed, 'RecapRecentlyViewed');
