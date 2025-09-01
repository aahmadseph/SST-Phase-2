import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;
import ReferrerPage from 'components/Campaigns/Referrer/Referrer';
import RwdAdvocacy from 'components/Campaigns/RwdAdvocacy';

const Referrer = () => {
    return Sephora.configurationSettings.isAdvocacyContentfulEnabled ? <RwdAdvocacy /> : <ReferrerPage />;
};

export default wrapFunctionalComponent(Referrer, 'Referrer');
