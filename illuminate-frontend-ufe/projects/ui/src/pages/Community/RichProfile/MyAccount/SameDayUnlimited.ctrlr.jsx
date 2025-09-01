/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';

import ConnectedSameDayUnlimited from 'components/RichProfile/MyAccount/Subscriptions/SameDayUnlimited';

class SameDayUnlimited extends BaseClass {
    render() {
        return (
            <div>
                <ConnectedSameDayUnlimited />
            </div>
        );
    }
}

export default wrapComponent(SameDayUnlimited, 'SameDayUnlimited', true);
