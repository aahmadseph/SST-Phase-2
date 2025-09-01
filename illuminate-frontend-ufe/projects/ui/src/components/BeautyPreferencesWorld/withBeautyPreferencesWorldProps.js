import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import BeautyPreferencesWorldActions from 'actions/BeautyPreferencesWorldActions';
import Empty from 'constants/empty';
import RecommendationsServiceActions from 'actions/RecommendationsServiceActions.js';
import { recommendationsServiceSelector } from 'selectors/recommendationsService/recommendationsServiceSelector';
import { isAnonymousSelector } from 'selectors/auth/isAnonymousSelector';
import Actions from 'Actions';
import { customerPreferenceSelector } from 'selectors/user/customerPreferenceSelector';

const { wrapHOC } = FrameworkUtils;
const { showBiRegisterModal } = Actions;

const fields = createSelector(
    userSelector,
    recommendationsServiceSelector,
    isAnonymousSelector,
    customerPreferenceSelector,
    (user, recommendationsService, isAnonymous, customerPreference) => {
        // Handle both colorIQ (uppercase) and colorIq (lowercase) field names from different API sources
        const colorIQ = user.colorIQ || user.colorIq || Empty.array;
        const isBIUser = !!user.beautyInsiderAccount;

        return {
            customerPreference,
            colorIQ,
            recommendations: recommendationsService.recommendations,
            isAnonymous,
            user,
            isBIUser
        };
    }
);

const functions = {
    updateCustomerPreference: BeautyPreferencesWorldActions.updateCustomerPreference,
    saveColorIQ: BeautyPreferencesWorldActions.saveColorIQ,
    fetchColorIQLabDescriptions: BeautyPreferencesWorldActions.fetchColorIQLabDescriptions,
    fetchRecommendations: payload => RecommendationsServiceActions.fetchRecommendations(payload),
    showBiRegisterModal
};

const withBeautyPreferencesWorldProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withBeautyPreferencesWorldProps
};
