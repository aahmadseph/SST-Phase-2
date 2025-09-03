import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Icon } from 'components/ui';
import ErrorMsg from 'components/ErrorMsg';

const UpdateError = function ({ pleaseUpdateInfoMessage }) {
    return (
        <ErrorMsg
            fontSize='inherit'
            marginBottom='0'
        >
            <Icon
                name='alert'
                size='1.25em'
                marginRight='.5em'
            />
            <span data-at={Sephora.debug.dataAt('collapsed_accordion_error')}>{pleaseUpdateInfoMessage}</span>
        </ErrorMsg>
    );
};

export default wrapFunctionalComponent(UpdateError, 'UpdateError');
