/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
import BaseClass from 'components/BaseClass';

const { wrapComponent } = framework;
import ConnectedBeautyPreferences from 'components/Header/BeautyPreferences';

class BeautyPreferences extends BaseClass {
    render() {
        return (
            <div>
                <ConnectedBeautyPreferences />
            </div>
        );
    }
}

export default wrapComponent(BeautyPreferences, 'BeautyPreferences');
