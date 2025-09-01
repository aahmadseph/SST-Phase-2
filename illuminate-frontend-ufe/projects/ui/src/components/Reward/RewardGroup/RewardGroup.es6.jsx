import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { Box } from 'components/ui';

class RewardGroup extends BaseClass {
    state = {
        activeItem: null
    };

    onChildExpand(key) {
        this.setState({ activeItem: key });
    }

    render() {
        const { isCarousel, isCheckout, ...props } = this.props;

        const children = React.Children.map(this.props.children, (child, index) => {
            if (!child) {
                return null;
            }

            let collapse = null;

            if (this.state.activeItem !== null) {
                collapse = this.state.activeItem !== index;
            }

            return React.cloneElement(child, {
                key: index,
                onExpand: () => this.onChildExpand(index),
                forceCollapse: collapse,
                isCollapsible: true,
                isCarousel,
                isCheckout
            });
        });

        return children && children.length ? (
            <Box
                baseCss={{ '&:empty': { display: 'none' } }}
                {...props}
                children={children}
            />
        ) : null;
    }
}

export default wrapComponent(RewardGroup, 'RewardGroup');
