import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;

import { itemSubstitutionSelector } from 'selectors/itemSubstitution/itemSubstitutionSelector';

const fields = createSelector(itemSubstitutionSelector, itemSubstitution => {
    const { selectedProductId, recoProducts } = itemSubstitution;

    return {
        selectedProductId,
        recoProducts
    };
});

const withRecoProductsListProps = wrapHOC(connect(fields));

export {
    fields, withRecoProductsListProps
};
