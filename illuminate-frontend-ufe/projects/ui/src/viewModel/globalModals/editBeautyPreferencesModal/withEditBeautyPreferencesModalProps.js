import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import Actions from 'Actions';
import { userSelector } from 'selectors/user/userSelector';
import BeautyPreferencesWorldActions from 'actions/BeautyPreferencesWorldActions';
import { customerPreferenceSelector } from 'selectors/user/customerPreferenceSelector';

const { showEditBeautyPreferencesModal } = Actions;
const { updateCustomerPreference } = BeautyPreferencesWorldActions;

const { wrapHOC } = FrameworkUtils;

const fields = createSelector(userSelector, customerPreferenceSelector, (user, customerPreference) => {
    return {
        profileId: user.profileId,
        customerPreference
    };
});

const functions = { showEditBeautyPreferencesModal, updateCustomerPreference };
const withEditBeautyPreferencesModalProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withEditBeautyPreferencesModalProps
};
