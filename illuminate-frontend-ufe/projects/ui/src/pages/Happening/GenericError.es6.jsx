/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import GenericErrorPage from 'components/Happening/GenericError';

class GenericError extends BaseClass {
    render() {
        return (
            <div>
                <GenericErrorPage />
            </div>
        );
    }
}

export default wrapComponent(GenericError, 'GenericError');
