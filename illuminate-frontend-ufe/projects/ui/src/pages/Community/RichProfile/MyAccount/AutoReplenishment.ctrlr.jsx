/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';

import AutoReplenishmentMain from 'components/RichProfile/MyAccount/AutoReplenishment/AutoReplenishmentMain';

class AutoReplenishment extends BaseClass {
    render() {
        return (
            <div>
                <AutoReplenishmentMain />
            </div>
        );
    }
}

export default wrapComponent(AutoReplenishment, 'AutoReplenishment', true);
