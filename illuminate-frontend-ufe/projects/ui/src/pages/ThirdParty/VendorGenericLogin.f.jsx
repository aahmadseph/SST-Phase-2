import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import VendorLoginPage from 'components/VendorLoginPage/VendorLoginPage';

const VendorGenericLogin = () => {
    return (
        <div>
            <VendorLoginPage isAttentiveLogin={false} />
        </div>
    );
};

export default wrapFunctionalComponent(VendorGenericLogin, 'VendorGenericLogin');
