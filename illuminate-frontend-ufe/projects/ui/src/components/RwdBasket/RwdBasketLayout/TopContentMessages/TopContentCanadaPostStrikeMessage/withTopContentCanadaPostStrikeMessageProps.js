import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import { BASKET_TYPES } from 'constants/RwdBasket';
import Empty from 'constants/empty';

import itemsByBasketSelector from 'selectors/basket/itemsByBasket/itemsByBasketSelector';

const fields = createSelector(itemsByBasketSelector, itemsByBasket => {
    const isCanadaPostStrikeEnabled = !!Sephora?.configurationSettings?.canadaPostStrikeConfiguration?.isCanadaPostStrikeEnabled;
    const isBasketEmpty = itemsByBasket.length === 0;
    const standardBasket = itemsByBasket.find(basket => basket.basketType === BASKET_TYPES.STANDARD_BASKET) || Empty.Object;
    const hasItemInStandardBasket = !!standardBasket?.itemsCount > 0;
    const shouldRender = isCanadaPostStrikeEnabled && (isBasketEmpty || hasItemInStandardBasket);

    return {
        shouldRender
    };
});

const withTopContentCanadaPostStrikeMessageProps = wrapHOC(connect(fields, null));

export {
    fields, withTopContentCanadaPostStrikeMessageProps
};
