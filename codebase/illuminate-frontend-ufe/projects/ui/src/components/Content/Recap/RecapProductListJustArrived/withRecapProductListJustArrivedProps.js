/* eslint-disable camelcase */
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import Empty from 'constants/empty';
import { CONSTRUCTOR_PODS } from 'constants/constructorConstants';

import ConstructorRecsSelector from 'selectors/constructorRecs/constructorRecsSelector';
const { constructorRecsSelector } = ConstructorRecsSelector;
const contentfulSkuListSelector = (_state, ownProps) => ownProps.skuList || Empty.Array;

const fields = createSelector(constructorRecsSelector, contentfulSkuListSelector, (constructorRecs, contentfulSkuList) => {
    const constructorData = constructorRecs[CONSTRUCTOR_PODS.NEW_CONTENT_ALL] || Empty.Object;
    const skuList = constructorData.constructorRecommendations?.length > 0 ? constructorData.constructorRecommendations : contentfulSkuList;
    const isLoading = constructorData.isLoading ?? true;
    const shouldRender = isLoading || (!isLoading && !!skuList.length);

    return {
        shouldRender,
        isLoading,
        skuList
    };
});

const withRecapProductListJustArrivedProps = wrapHOC(connect(fields, null));

export {
    fields, withRecapProductListJustArrivedProps
};
