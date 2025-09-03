import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import RecommendationsServiceActions from 'actions/RecommendationsServiceActions.js';
import { recommendationsServiceSelector } from 'selectors/recommendationsService/recommendationsServiceSelector';
import { isAnonymousSelector } from 'selectors/auth/isAnonymousSelector';
import Empty from 'constants/empty';
import { customerPreferenceSelector } from 'selectors/user/customerPreferenceSelector';

const { wrapHOC } = FrameworkUtils;

const fields = createSelector(
    userSelector,
    recommendationsServiceSelector,
    isAnonymousSelector,
    customerPreferenceSelector,
    (user, recommendationsService, isAnonymous, customerPreference) => {
        const biAccount = user.beautyInsiderAccount || Empty.Object;

        return { customerPreference, recommendations: recommendationsService.recommendations, isAnonymous, biAccount };
    }
);

const functions = {
    fetchRecommendations: payload => RecommendationsServiceActions.fetchRecommendations(payload)
};

const withBeautyPreferencesProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withBeautyPreferencesProps
};
