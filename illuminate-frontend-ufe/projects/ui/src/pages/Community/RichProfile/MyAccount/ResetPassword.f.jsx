import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import ResetPasswordComp from 'components/ResetPassword/ResetPassword';

const ResetPassword = () => {
    return (
        <div>
            <ResetPasswordComp />
        </div>
    );
};

export default wrapFunctionalComponent(ResetPassword, 'ResetPassword');
