/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import withClientSideRenderOnly from 'hocs/withClientSideRenderOnly';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';

import ConnectedReplacementOrder from 'components/RichProfile/MyAccount/ReplacementOrder';

class ReplacementOrder extends BaseClass {
    render() {
        return (
            <div>
                <ConnectedReplacementOrder />
            </div>
        );
    }
}

export default withAfterEventsRendering(withClientSideRenderOnly()(wrapComponent(ReplacementOrder, 'ReplacementOrder')), ['UserInfoReady']);
