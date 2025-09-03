import React from 'react';

import rwdBasketUtils from 'utils/RwdBasket';

import * as RwdBasketConst from 'constants/RwdBasket';

const {
    MAIN_BASKET_TYPES: { DC_BASKET, BOPIS_BASKET }
} = RwdBasketConst;
import ComponentList from 'components/Content/ComponentList';

function getBottomContentComponentList({ content = [], bopisBottomContent = [] }, basket) {
    const params = { itemIds: rwdBasketUtils.getProductIdsFromStandardBasket(basket) };
    const bopisParams = { itemIds: rwdBasketUtils.getProductIdsFromStandardBasket(basket.pickupBasket) };

    const margins = {
        marginTop: [1, 0, 0, 7],
        marginBottom: [1, 0, 0, 7]
    };

    const saDBottomContentComponentList = (
        <ComponentList
            page='basket'
            items={content}
            params={params}
            customStyles={margins}
        />
    );
    const bopisBottomContentComponentList = (
        <ComponentList
            page='basket'
            items={bopisBottomContent}
            params={bopisParams}
            customStyles={margins}
        />
    );

    return {
        [DC_BASKET]: {
            isAvailable: content.length > 0,
            items: saDBottomContentComponentList
        },
        [BOPIS_BASKET]: {
            isAvailable: bopisBottomContent.length > 0,
            items: bopisBottomContentComponentList
        }
    };
}

export { getBottomContentComponentList };
