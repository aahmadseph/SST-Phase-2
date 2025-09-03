/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import framework from 'utils/framework';
import Happening from 'components/Happening';
import servicePageBindings from 'analytics/bindingMethods/pages/happeningAtSephora/servicesBindings';

const { wrapComponent } = framework;

class HappeningPage extends BaseClass {
    componentDidMount() {
        servicePageBindings.setPageLoadAnalytics();
    }

    render() {
        return <Happening />;
    }
}

export default wrapComponent(HappeningPage, 'HappeningPage', true);
