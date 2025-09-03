import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import ProductActions from 'actions/ProductActions';
import SponsoredProductsSelector from 'selectors/sponsoredProducts/sponsoredProductsSelector';

const { wrapHOC } = FrameworkUtils;
const { fireSponsoredProductClickTracking } = ProductActions;
const { sponsoredProductsSelector } = SponsoredProductsSelector;

const functions = {
    fireSponsoredProductClickTracking
};

const withRMNCarouselProps = wrapHOC(
    connect(
        createSelector(sponsoredProductsSelector, sponsoredProducts => {
            return {
                sponsoredProducts
            };
        }),
        functions
    )
);

export {
    functions, withRMNCarouselProps
};
