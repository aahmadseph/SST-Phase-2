/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box } from 'components/ui';
import DeliveryGroupItemsList from 'components/SharedComponents/SplitEDD/DeliveryGroupItemsList';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';

class SplitEDDItemsList extends BaseClass {
    componentDidMount() {
        const { updateSplitEDDExperienceDisplayed } = this.props;
        updateSplitEDDExperienceDisplayed(true);
        Storage.local.setItem(LOCAL_STORAGE.SPLIT_EDD_EXPERIENCE, true);
    }

    render() {
        const {
            totalDeliveryGroups,
            computedDeliveryGroups,
            shippingMethodType,
            isOrderDetail,
            orderItemComponentProps,
            productListItemForSplitEDD,
            showHeader,
            customStyle
        } = this.props;

        return (
            <Box css={[styles.root, customStyle.root, isOrderDetail ? styles.orderDetails : {}]}>
                {computedDeliveryGroups.map((deliveryGroup, index) => {
                    const shipmentNumber = index + 1;

                    return (
                        <DeliveryGroupItemsList
                            isOrderDetail={isOrderDetail}
                            shipmentNumber={shipmentNumber}
                            totalDeliveryGroups={totalDeliveryGroups}
                            deliveryGroup={deliveryGroup}
                            shippingMethodType={shippingMethodType}
                            orderItemComponentProps={orderItemComponentProps}
                            productListItemForSplitEDD={productListItemForSplitEDD}
                            showHeader={showHeader}
                        />
                    );
                })}
            </Box>
        );
    }
}

const styles = {
    root: {
        '& > :first-child .shippingMethodType': {
            display: 'block'
        },
        '& > :last-child': {
            paddingBottom: 0,
            marginBottom: 0
        }
    },
    orderDetails: {
        '& > :first-child .shippingMethodType': {
            display: 'none'
        }
    }
};

SplitEDDItemsList.propTypes = {
    isOrderDetail: PropTypes.bool,
    totalDeliveryGroups: PropTypes.number,
    computedDeliveryGroups: PropTypes.array,
    shippingMethodType: PropTypes.string,
    shippingGroupType: PropTypes.string,
    shippingGroup: PropTypes.shape({}),
    orderItemComponentProps: PropTypes.shape({}),
    customStyle: PropTypes.shape({}),
    updateSplitEDDExperienceDisplayed: PropTypes.func
};

SplitEDDItemsList.defaultProps = {
    isOrderDetail: false,
    totalDeliveryGroups: 0,
    computedDeliveryGroups: [],
    shippingMethodType: '',
    shippingGroupType: '',
    shippingGroup: {},
    orderItemComponentProps: {},
    customStyle: {},
    updateSplitEDDExperienceDisplayed: () => {}
};

export default wrapComponent(SplitEDDItemsList, 'SplitEDDItemsList', true);
