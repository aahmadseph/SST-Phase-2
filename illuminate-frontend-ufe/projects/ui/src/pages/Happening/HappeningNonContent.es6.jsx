/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
import BaseClass from 'components/BaseClass';
import HappeningNonContent from 'components/HappeningNonContent';

const { wrapComponent } = framework;

class HappeningNonContentPage extends BaseClass {
    render() {
        return <HappeningNonContent />;
    }
}

export default wrapComponent(HappeningNonContentPage, 'HappeningNonContentPage');
