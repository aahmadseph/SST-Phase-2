/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { HydrationFinished, UserInfoLoaded } from 'constants/events';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';

const { wrapComponent } = framework;
import ConnectedBeautyPreferences from 'components/BeautyPreferencesRedesigned';

class BeautyPreferencesRedesigned extends BaseClass {
    render() {
        return <ConnectedBeautyPreferences />;
    }
}

export default withAfterEventsRendering(wrapComponent(BeautyPreferencesRedesigned, 'BeautyPreferencesRedesigned', true), [
    HydrationFinished,
    UserInfoLoaded
]);
