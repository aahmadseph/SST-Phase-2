/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';

import ConnectedSmartSkinScan from 'components/SmartSkinScan';

class SmartSkinScan extends BaseClass {
    render() {
        return (
            <div>
                <ConnectedSmartSkinScan />
            </div>
        );
    }
}

export default wrapComponent(SmartSkinScan, 'SmartSkinScan');
