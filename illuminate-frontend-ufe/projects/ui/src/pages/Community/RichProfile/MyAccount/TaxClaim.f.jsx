import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;
import ConnectedTaxClaim from 'components/RichProfile/MyAccount/TaxClaim';

const TaxClaim = () => {
    return (
        <>
            <ConnectedTaxClaim />
        </>
    );
};

export default wrapFunctionalComponent(TaxClaim, 'TaxClaim');
