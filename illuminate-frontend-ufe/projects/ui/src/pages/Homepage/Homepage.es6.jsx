/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';

import ConnectedHomepage from 'components/Homepage';

class Homepage extends BaseClass {
    render() {
        return (
            <div>
                <ConnectedHomepage />
            </div>
        );
    }
}

export default wrapComponent(Homepage, 'Homepage');
