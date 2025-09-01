import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;

import checkoutUtils from 'utils/Checkout';
import UtilActions from 'utils/redux/Actions';

const fields = createSelector(
    (_state, ownProps) => ownProps.shippingGroup,
    (_state, ownProps) => ownProps.shippingGroupType,
    (_state, ownProps) => ownProps.createDeliveryGroup,
    (shippingGroup, shippingGroupType, createDeliveryGroup) => {
        const computedDeliveryGroups = checkoutUtils.computeDeliveryGroups(shippingGroup, shippingGroupType, undefined, createDeliveryGroup);
        const totalDeliveryGroups = computedDeliveryGroups.length;

        return {
            shippingMethodType: shippingGroup?.shippingMethod?.shippingMethodType,
            computedDeliveryGroups: computedDeliveryGroups,
            totalDeliveryGroups
        };
    }
);

const functions = {
    updateSplitEDDExperienceDisplayed: splitEDDExperience => UtilActions.merge('order', 'splitEDDExperienceDisplayed', splitEDDExperience)
};

const withSplitEDDShippingMethodProps = wrapHOC(connect(fields, functions));

export {
    fields, withSplitEDDShippingMethodProps
};
