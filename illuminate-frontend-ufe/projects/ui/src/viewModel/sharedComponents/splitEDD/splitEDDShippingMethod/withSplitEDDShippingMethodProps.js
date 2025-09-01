import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;

import checkoutUtils from 'utils/Checkout';
import helpersUtils from 'utils/Helpers';
const { capitalizeFirstLetter } = helpersUtils;

const fields = createSelector(
    (_state, ownProps) => ownProps.shippingGroup,
    (_state, ownProps) => ownProps.shippingGroupType,
    (_state, ownProps) => ownProps.shippingMethod,
    (_state, ownProps) => ownProps.waiveShippingFee,
    (shippingGroup, shippingGroupType, _shippingMethod, waiveShippingFee) => {
        const shippingMethod = _shippingMethod || shippingGroup?.shippingMethod;
        const shippingFee = checkoutUtils.setShippingFee(shippingMethod?.shippingFee) || '';
        const capitalizedShippingFee = capitalizeFirstLetter(shippingFee, true);

        // The shippingMethod will be passed to the SplitEDDShippingMethod component
        // when rendering the list of shipping methods.
        // In this scenario, deliveryGroups will be computed from shippingMethod;
        // otherwise, they will be derived from shippingGroup.shippingMethod.
        const computedDeliveryGroups = checkoutUtils.computeDeliveryGroups(shippingGroup, shippingGroupType, _shippingMethod);

        return {
            shippingMethodType: shippingMethod?.shippingMethodType,
            promiseDateSplitCutOffDescription: checkoutUtils.getPromiseDateCutOffDescription(shippingMethod?.promiseDateSplitCutOffDescription),
            shippingFee: capitalizedShippingFee,
            computedDeliveryGroups: computedDeliveryGroups,
            waiveShippingFeeCheck: waiveShippingFee
        };
    }
);

const withSplitEDDShippingMethodProps = wrapHOC(connect(fields, null));

export {
    fields, withSplitEDDShippingMethodProps
};
