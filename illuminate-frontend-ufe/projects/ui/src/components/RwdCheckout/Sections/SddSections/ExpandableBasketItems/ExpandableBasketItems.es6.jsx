import { Divider, Box } from 'components/ui';
import BaseClass from 'components/BaseClass';
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import CheckoutItemsList from 'components/RwdCheckout/OrderSummary/CheckoutItemsList';
import MediaUtils from 'utils/Media';
const { Media } = MediaUtils;

const LARGE_ITEMS_VISIBLE = 12;

class ExpandableBasketItems extends BaseClass {
    renderItems = itemsVisibles => {
        const { items = [], basketType, itemsCount, sddTitle } = this.props;

        const basket = basketType ?? 'shipped';

        return (
            <CheckoutItemsList
                basketType={basket}
                items={items}
                itemsCount={itemsCount}
                itemsVisibles={itemsVisibles}
                {...(sddTitle && { title: sddTitle })}
            />
        );
    };
    render() {
        const { items = [], basketType } = this.props;

        return (
            <>
                {!basketType && <Divider marginY={3} />}
                <Box>
                    <Media lessThan='sm'>{this.renderItems(6)}</Media>
                    <Media greaterThan='xs'>{this.renderItems(items.length < LARGE_ITEMS_VISIBLE ? items.length : LARGE_ITEMS_VISIBLE)}</Media>
                </Box>
            </>
        );
    }
}

ExpandableBasketItems.propTypes = {
    items: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
};

export default wrapComponent(ExpandableBasketItems, 'ExpandableBasketItems');
