import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import VendorLoginPage from 'components/VendorLoginPage/VendorLoginPage';

const VendorLogin = () => {
    return (
        <div>
            <VendorLoginPage isAttentiveLogin={true} />
        </div>
    );
};

export default wrapFunctionalComponent(VendorLogin, 'VendorLogin');
