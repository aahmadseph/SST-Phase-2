/* eslint-disable class-methods-use-this */
/* eslint-disable object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import ErrorUtils from 'utils/Errors';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const COMPROMISED_PASSWORD = 'login.credentials';
const CREATE_USER_COMPROMISED_PASSWORD = 'create.user.credentials';

class MNW extends BaseClass {
    triggerLoginProfileWarnings = () => {
        const { isAnonymous, showPasswordResetRecommendation, showPasswordResetAfterSignup } = this.props;
        const loginProfileWarnings = Storage.local.getItem(LOCAL_STORAGE.LOGIN_PROFILE_WARNINGS);
        const loginMessage = ErrorUtils.getBackendError(loginProfileWarnings, COMPROMISED_PASSWORD);
        const createAccountMessage = ErrorUtils.getBackendError(loginProfileWarnings, CREATE_USER_COMPROMISED_PASSWORD);
        const postponeLoginProfileWarnings = Storage.local.getItem(LOCAL_STORAGE.POSTPONE_LOGIN_PROFILE_WARNINGS);
        const shouldShowPasswordResetRecommendation = !postponeLoginProfileWarnings && loginProfileWarnings && !isAnonymous;

        if (shouldShowPasswordResetRecommendation) {
            if (loginMessage) {
                showPasswordResetRecommendation(loginMessage);
            } else if (createAccountMessage) {
                showPasswordResetAfterSignup(createAccountMessage);
            }
        }
    };

    componentDidUpdate() {
        this.triggerLoginProfileWarnings();
    }

    componentDidMount() {
        this.triggerLoginProfileWarnings();
    }

    render() {
        return <div />;
    }
}

MNW.propTypes = {
    showPasswordResetRecommendation: PropTypes.func.isRequired,
    showPasswordResetAfterSignup: PropTypes.func.isRequired,
    isAnonymous: PropTypes.bool.isRequired
};

export default wrapComponent(MNW, 'MNW', true);
