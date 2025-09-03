import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import AllStoreServices from 'components/RichProfile/StoreServices/AllStoreServices';

const InstoreServices = () => {
    return (
        <div>
            <AllStoreServices />
        </div>
    );
};

export default wrapFunctionalComponent(InstoreServices, 'InstoreServices');
