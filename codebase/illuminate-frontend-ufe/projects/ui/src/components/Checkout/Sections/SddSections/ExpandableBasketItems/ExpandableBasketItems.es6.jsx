import { Divider, Box } from 'components/ui';
import BaseClass from 'components/BaseClass';
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import CheckoutItemsList from 'components/Checkout/OrderSummary/CheckoutItemsList/CheckoutItemsList';

const LARGE_ITEMS_VISIBLE = 12;

class ExpandableBasketItems extends BaseClass {
    render() {
        const {
            items = [], basketType, itemsCount, sddTitle, experience
        } = this.props;

        return (
            <>
                <>
                    {!basketType && <Divider marginY={3} />}
                    <Box>
                        <CheckoutItemsList
                            basketType={basketType ?? 'shipped'}
                            items={items}
                            itemsCount={itemsCount}
                            itemsVisibles={Sephora.isMobile() ? 6 : items.length < LARGE_ITEMS_VISIBLE ? items.length : LARGE_ITEMS_VISIBLE}
                            experience={experience}
                            {...(sddTitle && { title: sddTitle })}
                        />
                    </Box>
                </>
            </>
        );
    }
}

ExpandableBasketItems.propTypes = {
    items: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
};

export default wrapComponent(ExpandableBasketItems, 'ExpandableBasketItems');
