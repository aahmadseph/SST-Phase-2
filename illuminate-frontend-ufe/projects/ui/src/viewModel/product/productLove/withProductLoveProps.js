import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { createStructuredSelector } from 'reselect';
import ShoppingListIdsSelector from 'selectors/loves/shoppingListIds/shoppingListIdsSelector';
import basketSelector from 'selectors/basket/basketSelector';
import LoveActions from 'actions/LoveActions';

const { wrapHOC } = FrameworkUtils;
const { shoppingListIdsSelector } = ShoppingListIdsSelector;

const fields = createStructuredSelector({
    shoppingListIds: shoppingListIdsSelector,
    basket: basketSelector
});

const functions = {
    addLove: LoveActions.addLove,
    removeLove: LoveActions.removeLove,
    showMyListsModal: LoveActions.showMyListsModal,
    setSkuLoveData: LoveActions.setSkuLoveData,
    setSkuLoveImageData: LoveActions.setSkuLoveImageData
};

const withProductLoveProps = wrapHOC(connect(fields, functions));

export {
    withProductLoveProps, fields, functions
};
