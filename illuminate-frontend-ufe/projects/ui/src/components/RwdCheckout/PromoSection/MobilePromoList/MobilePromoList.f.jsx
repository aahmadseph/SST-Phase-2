import React from 'react';

import FrameworkUtils from 'utils/framework';
import { Divider } from 'components/ui';
import BasketListItem from 'components/RwdCheckout/PromoSection/BasketList/BasketListItem';
import TestTarget from 'components/TestTarget/TestTarget';

const { wrapFunctionalComponent } = FrameworkUtils;

function MobilePromoList({ promos }) {
    if (!promos || !Array.isArray(promos) || !promos.length) {
        return null;
    }

    return (
        <React.Fragment>
            {promos.map(item => (
                <React.Fragment key={item.commerceId}>
                    <TestTarget
                        testEnabled
                        allowQuantityChange={false}
                        item={item}
                        testName='basketQuickLookModal'
                        testComponent={BasketListItem}
                    />
                    <Divider marginY={4} />
                </React.Fragment>
            ))}
        </React.Fragment>
    );
}

export default wrapFunctionalComponent(MobilePromoList, 'MobilePromoList');
