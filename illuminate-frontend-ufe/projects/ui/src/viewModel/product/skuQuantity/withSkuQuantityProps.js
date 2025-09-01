import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import basketSelector from 'selectors/basket/basketSelector';
import { showQuantityPickerSelector } from 'viewModel/selectors/testTarget/showQuantityPickerSelector';

const { wrapHOC } = FrameworkUtils;
const fields = createSelector(basketSelector, showQuantityPickerSelector, (basket, showQuantityPicker) => {
    return {
        basket,
        showQuantityPicker
    };
});

const withSkuQuantityProps = wrapHOC(connect(fields));

export {
    withSkuQuantityProps, fields
};
