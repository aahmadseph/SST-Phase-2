/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';

import ConnectedReplacementOrderStatus from 'components/RichProfile/MyAccount/ReplacementOrderStatus';

class ReplacementOrderStatus extends BaseClass {
    render() {
        return (
            <div>
                <ConnectedReplacementOrderStatus />
            </div>
        );
    }
}

export default wrapComponent(ReplacementOrderStatus, 'ReplacementOrderStatus');
