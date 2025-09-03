/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Text, Box } from 'components/ui';
import DeliveryGroups from 'components/SharedComponents/SplitEDD/DeliveryGroups';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

class SplitEDDShippingMethod extends BaseClass {
    componentWillUnmount() {
        Storage.local.removeItem(LOCAL_STORAGE.SPLIT_EDD_EXPERIENCE);
    }

    componentDidMount() {
        Storage.local.setItem(LOCAL_STORAGE.SPLIT_EDD_EXPERIENCE, true);
    }

    render() {
        const {
            showDescription,
            shippingMethodType,
            shippingFee,
            showCutOffDescription,
            promiseDateSplitCutOffDescription,
            computedDeliveryGroups,
            marginTop,
            waiveShippingFeeCheck
        } = this.props;

        return (
            <Box marginTop={marginTop}>
                {showDescription && (
                    <>
                        <Text
                            is='p'
                            fontWeight='bold'
                        >
                            {`${
                                waiveShippingFeeCheck ? `Waive Shipping & Handling - ${shippingMethodType}` : `${shippingMethodType} - ${shippingFee}`
                            }`}
                        </Text>
                        {showCutOffDescription && promiseDateSplitCutOffDescription && (
                            <Text
                                is='p'
                                fontSize='sm'
                                lineHeight='tight'
                            >
                                {promiseDateSplitCutOffDescription}
                            </Text>
                        )}
                    </>
                )}
                <DeliveryGroups computedDeliveryGroups={computedDeliveryGroups} />
            </Box>
        );
    }
}

SplitEDDShippingMethod.propTypes = {
    shippingGroup: PropTypes.shape({}),
    shippingGroupType: PropTypes.string,
    showDescription: PropTypes.bool,
    shippingMethodType: PropTypes.string,
    showCutOffDescription: PropTypes.bool,
    promiseDateSplitCutOffDescription: PropTypes.string,
    shippingFee: PropTypes.string,
    marginTop: PropTypes.number,
    waiveShippingFeeCheck: PropTypes.bool
};

SplitEDDShippingMethod.defaultProps = {
    shippingGroup: {},
    shippingGroupType: '',
    showDescription: true,
    shippingMethodType: '',
    showCutOffDescription: true,
    promiseDateSplitCutOffDescription: '',
    shippingFee: '',
    marginTop: 5,
    waiveShippingFeeCheck: false
};

export default wrapComponent(SplitEDDShippingMethod, 'SplitEDDShippingMethod', true);
