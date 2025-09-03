import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import OrderDetail from 'components/RichProfile/MyAccount/OrderDetail';
import SetPageAnalyticsProps from 'components/Analytics';
import AnaConst from 'analytics/constants';
const OrderDetails = () => {
    return (
        <div>
            <OrderDetail />
            <SetPageAnalyticsProps
                pageType={AnaConst.PAGE_TYPES.USER_PROFILE}
                pageName={AnaConst.PAGE_NAMES.MY_ACCOUNT}
                additionalPageInfo={AnaConst.PAGE_NAMES.ORDER_DETAIL}
            />
        </div>
    );
};

export default wrapFunctionalComponent(OrderDetails, 'OrderDetails');
