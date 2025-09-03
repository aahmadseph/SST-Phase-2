/* eslint-disable class-methods-use-this */

import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';

import ConnectedContentStorePage from 'components/ContentStore';

class RwdContentStore extends BaseClass {
    render() {
        return (
            <div>
                <ConnectedContentStorePage />
            </div>
        );
    }
}

export default wrapComponent(RwdContentStore, 'RwdContentStore');
