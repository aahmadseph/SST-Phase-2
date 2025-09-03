import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import RecapGrid from 'components/Content/Recap/RecapGrid/RecapGrid';
import RecapItem from 'components/Content/Recap/RecapItem';

function RecapPurchaseHistory({ purchaseHistoryItems, ...props }) {
    return (
        <RecapItem {...props}>
            <RecapGrid skuList={(purchaseHistoryItems || []).map(({ sku }) => sku)} />
        </RecapItem>
    );
}

RecapPurchaseHistory.propTypes = {
    purchaseHistoryItems: PropTypes.array
};

export default wrapFunctionalComponent(RecapPurchaseHistory, 'RecapPurchaseHistory');
