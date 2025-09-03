import BaseClass from 'components/BaseClass';
import React from 'react';
import { Container } from 'components/ui';
import RwdBasketRoot from 'components/RwdBasket/RwdBasketRoot';

import withClientSideRenderOnly from 'hocs/withClientSideRenderOnly';
import framework from 'utils/framework';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';

const { wrapComponent } = framework;

class RwdBasketpage extends BaseClass {
    // eslint-disable-next-line class-methods-use-this
    render() {
        return (
            <div>
                <Container is='main'>
                    <RwdBasketRoot />
                </Container>
            </div>
        );
    }
}

export default withAfterEventsRendering(withClientSideRenderOnly()(wrapComponent(RwdBasketpage, 'RwdBasketpage')), ['UserInfoReady']);
