import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import AffiliatesMain from 'components/Affiliates/AffiliatesMain';

const Affiliates = () => {
    const { linkshareCookiesLifetime } = Sephora.configurationSettings;

    return (
        <div>
            <AffiliatesMain linkshareCookiesLifetime={linkshareCookiesLifetime} />
        </div>
    );
};

export default wrapFunctionalComponent(Affiliates, 'Affiliates');
