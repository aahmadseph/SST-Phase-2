/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';

import ConnectedBuyPage from 'components/BuyPage/RwdBuy';

class RwdBuyPage extends BaseClass {
    render() {
        return (
            <div>
                <ConnectedBuyPage />
            </div>
        );
    }
}

export default wrapComponent(RwdBuyPage, 'RwdBuyPage');
