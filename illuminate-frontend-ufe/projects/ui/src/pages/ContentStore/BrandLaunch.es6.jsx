import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import BrandLaunch from 'components/Brand/BrandLaunch';

class BrandLaunchPage extends BaseClass {
    render() {
        return (
            <div>
                <BrandLaunch {...this.props} />
            </div>
        );
    }
}

export default wrapComponent(BrandLaunchPage, 'BrandLaunchPage');
