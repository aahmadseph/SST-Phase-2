import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import basketSelector from 'selectors/basket/basketSelector';
import { showQuantityPickerSelector } from 'viewModel/selectors/testTarget/showQuantityPickerSelector';
import addToBasketActions from 'actions/AddToBasketActions';
import { authSelector } from 'selectors/auth/authSelector';
import itemsByBasketSelector from 'selectors/basket/itemsByBasket/itemsByBasketSelector';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
const { updateSkuQuantity } = RwdBasketActions;

const { wrapHOC } = FrameworkUtils;

const fields = createStructuredSelector({
    basket: basketSelector,
    showQuantityPicker: showQuantityPickerSelector,
    auth: authSelector,
    itemsByBasket: itemsByBasketSelector
});

const functions = {
    addToBasket: addToBasketActions.addToBasket,
    removeItemFromBasket: addToBasketActions.removeItemFromBasket,
    updateSkuQuantity
};

const withCallToActionProps = wrapHOC(connect(fields, functions));

export {
    fields, withCallToActionProps
};
