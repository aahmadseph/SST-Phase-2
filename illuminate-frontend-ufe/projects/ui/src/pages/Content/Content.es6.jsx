/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';

import ConnectedContentpage from 'components/Content';

class Content extends BaseClass {
    render() {
        return (
            <div>
                <ConnectedContentpage />
            </div>
        );
    }
}

export default wrapComponent(Content, 'Content');
