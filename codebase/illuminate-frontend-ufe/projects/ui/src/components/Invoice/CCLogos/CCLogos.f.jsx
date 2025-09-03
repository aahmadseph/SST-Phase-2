import React from 'react';
import { Image, Flex } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';

const ICON_PROPS = {
    disableLazyLoad: true,
    marginX: 2,
    width: 50,
    height: 32
};

const CREDIT_CARDS = [
    { src: 'visa', alt: 'VISA' },
    { src: 'masterCard', alt: 'MasterCard' },
    { src: 'americanExpress', alt: 'American Express' },
    { src: 'discover', alt: 'Discover' }
];

function CCLogos() {
    return (
        <Flex
            marginTop={1}
            marginBottom={4}
            marginX={-2}
        >
            {CREDIT_CARDS.map(creditCard => (
                <Image
                    key={creditCard.alt}
                    src={`/img/ufe/payments/${creditCard.src}.svg`}
                    alt={creditCard.alt}
                    {...ICON_PROPS}
                />
            ))}
        </Flex>
    );
}

export default wrapFunctionalComponent(CCLogos, 'CCLogos');
