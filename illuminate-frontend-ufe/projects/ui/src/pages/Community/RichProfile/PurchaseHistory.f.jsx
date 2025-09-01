import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import TestTarget from 'components/TestTarget/TestTarget';
import PurchaseHistoryList from 'components/RichProfile/PurchaseHistoryList/PurchaseHistoryList';
const PurchaseHistory = () => {
    return (
        <div>
            <TestTarget
                testName='replenCarouselPurchaseHistory'
                testComponent={PurchaseHistoryList}
                testEnabled
            />
        </div>
    );
};

export default wrapFunctionalComponent(PurchaseHistory, 'PurchaseHistory');
