/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import TargetedLandingPromotion from 'components/Content/TargetedLandingPromotion';
import BeautyWinPromo from 'pages/ContentStore/BeautyWinPromo';

class TargetedLandingPage extends BaseClass {
    render() {
        return Sephora.configurationSettings.isTlpContentfulEnabled ? <TargetedLandingPromotion /> : <BeautyWinPromo {...this.props} />;
    }
}

export default wrapComponent(TargetedLandingPage, 'TargetedLandingPage', true);
