/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import { HydrationFinished, UserInfoLoaded } from 'constants/events';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';
import ShopMyStoreMain from 'components/ShopYourStore/ShopMyStoreMain';

class ShopMyStore extends BaseClass {
    render() {
        return <ShopMyStoreMain />;
    }
}

export default withAfterEventsRendering(wrapComponent(ShopMyStore, 'ShopMyStore', true), [HydrationFinished, UserInfoLoaded]);
