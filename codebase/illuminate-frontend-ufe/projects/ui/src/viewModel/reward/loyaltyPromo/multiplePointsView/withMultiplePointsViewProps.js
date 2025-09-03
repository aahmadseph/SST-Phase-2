import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import actions from 'Actions';
import netBeautyBankPointsAvailableSelector from 'selectors/basket/netBeautyBankPointsAvailableSelector';
import pickupBasketSelector from 'selectors/basket/pickupBasket/netBeautyBankPointsAvailableSelector';
import BasketBindings from 'analytics/bindingMethods/pages/basket/BasketBindings';

const { netBeautyBankPointsAvailableSelector: pickupNetBeautyBankPointsAvailableSelector } = pickupBasketSelector;

export default connect(
    createStructuredSelector({
        netBeautyBankPointsAvailable: netBeautyBankPointsAvailableSelector,
        pickupNetBeautyBankPointsAvailable: pickupNetBeautyBankPointsAvailableSelector
    }),
    { showApplyRewardsModal: actions.showApplyRewardsModal, expandPointsSection: BasketBindings.expandPointsSection },
    (stateProps, dispatchProps, ownProps) => {
        const isBopis = ownProps.isBopis;
        const { netBeautyBankPointsAvailable, pickupNetBeautyBankPointsAvailable, ...restStateProps } = stateProps;

        const resultedNetBeautyBankPointsAvailable = isBopis ? pickupNetBeautyBankPointsAvailable : netBeautyBankPointsAvailable;

        return {
            ...ownProps,
            ...restStateProps,
            netBeautyBankPointsAvailable: resultedNetBeautyBankPointsAvailable,
            ...dispatchProps
        };
    }
);
