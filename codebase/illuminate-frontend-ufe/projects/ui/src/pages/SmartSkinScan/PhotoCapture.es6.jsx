/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';

import ConnectedPhotoCapture from 'components/SmartSkinScan/PhotoCapture';

class PhotoCapture extends BaseClass {
    render() {
        return (
            <div>
                <ConnectedPhotoCapture />
            </div>
        );
    }
}

export default wrapComponent(PhotoCapture, 'PhotoCapture');
