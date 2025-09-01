import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import AccountInfo from 'components/RichProfile/MyAccount/AccountInfo/AccountInfo';
import ufeApi from 'services/api/ufeApi';

// Define the MyAccount component
const MyAccount = () => {
    return (
        <div>
            <AccountInfo requestCounter={ufeApi.getCallsCounter()} />
        </div>
    );
};

export default wrapFunctionalComponent(MyAccount, 'MyAccount');
