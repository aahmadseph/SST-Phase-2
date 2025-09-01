import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import RecentOrders from 'components/RichProfile/MyAccount/RecentOrders/RecentOrders';
import ufeApi from 'services/api/ufeApi';

const Orders = () => {
    return (
        <div>
            <RecentOrders requestCounter={ufeApi.getCallsCounter()} />
        </div>
    );
};

export default wrapFunctionalComponent(Orders, 'Orders');
