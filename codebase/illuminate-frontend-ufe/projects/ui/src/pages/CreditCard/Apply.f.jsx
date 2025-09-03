import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import ApplyFlowMain from 'components/CreditCard/ApplyFlow/ApplyFlowMain';
import ufeApi from 'services/api/ufeApi';

const Apply = props => {
    const nonPreApprovedContent = props.regions && props.regions.right;

    return (
        <div>
            <ApplyFlowMain
                nonPreApprovedContent={nonPreApprovedContent}
                requestCounter={ufeApi.getCallsCounter()}
            />
        </div>
    );
};

export default wrapFunctionalComponent(Apply, 'Apply');
