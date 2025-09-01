/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import { HydrationFinished, UserInfoLoaded } from 'constants/events';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';
import ShopSameDayMain from 'components/ShopYourStore/ShopSameDayMain';

class ShopSameDay extends BaseClass {
    render() {
        return <ShopSameDayMain />;
    }
}

export default withAfterEventsRendering(wrapComponent(ShopSameDay, 'ShopSameDay', true), [HydrationFinished, UserInfoLoaded]);
