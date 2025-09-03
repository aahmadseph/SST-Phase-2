import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import CreditCards from 'components/RichProfile/CreditCards';

const CreditCard = () => {
    return (
        <div>
            <CreditCards />
        </div>
    );
};

export default wrapFunctionalComponent(CreditCard, 'CreditCard');
