import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import CreditCardApplication from 'components/Content/CreditCards/CreditCardApplication';

const LayoutCreditCardApplication = props => {
    return <CreditCardApplication {...props} />;
};

export default wrapFunctionalComponent(LayoutCreditCardApplication, 'LayoutCreditCardApplication');
