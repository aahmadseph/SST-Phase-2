/* eslint-disable eqeqeq */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Icon } from 'components/ui';
import store from 'Store';
import skuHelpers from 'utils/skuHelpers';

class LovesCount extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {};
        /**
         * API doesn't respond immediately with proper count of product loves.
         * Count will be updated on server side only in 3 hours,
         * so we need to listen for user loves actions and mimic the effect of
         * immediate updating of Product loves count
         */
        store.setAndWatch({ 'loves.shoppingListIds': 'loves' }, this, null, store.STATE_STRATEGIES.CLIENT_SIDE_DATA);
    }

    render() {
        const lovesCount = skuHelpers.getProductLovesCount(this.props.product);

        return (
            <div css={{ display: 'flex' }}>
                <Icon
                    name='heart'
                    size='11px'
                    css={{ top: 1 }}
                />
                <span
                    css={{
                        marginLeft: '.4em',
                        position: 'relative',
                        top: '.09em'
                    }}
                >
                    {lovesCount}
                </span>
            </div>
        );
    }
}

export default wrapComponent(LovesCount, 'LovesCount', true);
