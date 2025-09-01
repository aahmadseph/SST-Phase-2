/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import { modal } from 'style/config';
import { Divider } from 'components/ui';

class ContentDivider extends BaseClass {
    constructor(props) {
        super(props);
    }

    render() {
        return Sephora.isMobile() ? (
            <Divider
                marginY={4}
                marginX={modal.outdentX}
                height={3}
                color='nearWhite'
            />
        ) : (
            <Divider
                marginY={6}
                marginX={-5}
            />
        );
    }
}

export default wrapComponent(ContentDivider, 'ContentDivider');
