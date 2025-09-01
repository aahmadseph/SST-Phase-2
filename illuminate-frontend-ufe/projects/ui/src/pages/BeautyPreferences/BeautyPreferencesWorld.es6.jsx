/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { HydrationFinished, UserInfoLoaded } from 'constants/events';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';

const { wrapComponent } = framework;
import ConnectedBeautyPreferencesWorld from 'components/BeautyPreferencesWorld';

class BeautyPreferencesWorld extends BaseClass {
    render() {
        return <ConnectedBeautyPreferencesWorld />;
    }
}

export default withAfterEventsRendering(wrapComponent(BeautyPreferencesWorld, 'BeautyPreferencesWorld', true), [HydrationFinished, UserInfoLoaded]);
