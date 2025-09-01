import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Container } from 'components/ui';
import CreditCardLanding from 'components/Content/CreditCards/CreditCardLanding';

const LayoutCreditCardPage = ({ content }) => {
    return (
        <Container paddingX={[0, 4]}>
            <CreditCardLanding content={content} />
        </Container>
    );
};

export default wrapFunctionalComponent(LayoutCreditCardPage, 'LayoutCreditCardPage');
