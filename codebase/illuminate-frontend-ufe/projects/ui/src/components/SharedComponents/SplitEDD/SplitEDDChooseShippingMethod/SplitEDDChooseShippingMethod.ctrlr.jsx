/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Grid } from 'components/ui';
import checkoutUtils from 'utils/Checkout';

import ShippingMethodOption from 'components/SharedComponents/SplitEDD/ShippingMethodOption/';

class SplitEDDChooseShippingMethod extends BaseClass {
    state = {
        selectedShippingMethodId: checkoutUtils.getDefaultShippingMethodId(this.props)
    };

    // handleSaveForm in ShipOptionsForm.ctrlr.jsx needs
    // this method to get the entire shipping method object
    // of the current selection to enter the "Save" flow.
    // This method purpose is to make Split EDD compatible
    // with the current implementation without changing anything
    // outside this component.
    getData = () => {
        const { selectedShippingMethodId } = this.state;
        const { shippingMethods } = this.props;
        const shippingMethodObj = shippingMethods.find(shippingMethod => shippingMethod.shippingMethodId === selectedShippingMethodId);

        return shippingMethodObj;
    };

    setShippingMethod = event => {
        const selectedShippingMethodId = event.target.value;
        this.setState({ selectedShippingMethodId });
    };

    render() {
        const { shippingMethods, shippingGroup } = this.props;
        const { selectedShippingMethodId } = this.state;

        return (
            <Grid
                is='form'
                marginTop={4}
            >
                <Grid
                    is='fieldset'
                    gap={2}
                    columns={[1, 4]}
                >
                    {shippingMethods.map(shippingMethod => {
                        const isSelected = selectedShippingMethodId === shippingMethod?.shippingMethodId;

                        return (
                            <ShippingMethodOption
                                isSelected={isSelected}
                                setShippingMethod={this.setShippingMethod}
                                shippingMethod={shippingMethod}
                                shippingGroup={shippingGroup}
                            />
                        );
                    })}
                </Grid>
            </Grid>
        );
    }
}

SplitEDDChooseShippingMethod.propTypes = {
    shippingMethods: PropTypes.array
};

SplitEDDChooseShippingMethod.defaultProps = {
    shippingMethods: []
};

export default wrapComponent(SplitEDDChooseShippingMethod, 'SplitEDDChooseShippingMethod', true);
