import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import ConstructorRecsActions from 'actions/ConstructorRecsActions';
import ConstructorRecsSelector from 'selectors/constructorRecs/constructorRecsSelector';
import { CONSTRUCTOR_PODS } from 'constants/constructorConstants';

const { wrapHOC } = FrameworkUtils;
const { constructorRecsSelector } = ConstructorRecsSelector;
const { updateRequestData } = ConstructorRecsActions;
const fields = createSelector(constructorRecsSelector, constructorRecs => {
    const currentRecs = constructorRecs[CONSTRUCTOR_PODS.FREQUENTLY_BOUGHT_TOGETHER];

    if (!currentRecs?.isError && !currentRecs?.isEmpty) {
        const { constructorRecommendations: recs = [], constructorTitle: title = '', totalResults, resultId } = currentRecs || {};

        return { recs, title, totalResults, resultId };
    }

    return { recs: [], title: '' };
});

const functions = { updateRequestData };
const withFrequentlyBoughtTogetherProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withFrequentlyBoughtTogetherProps
};
