import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import { Container, Flex } from 'components/ui';
import Logo from 'components/Logo/Logo';

function CompactHeader() {
    return (
        <Flex
            is={'header'}
            boxShadow={'0 1px 4px 0 var(--color-darken2)'}
            paddingY={[4, null, 6]}
        >
            <Container>
                <Logo />
            </Container>
        </Flex>
    );
}

export default wrapFunctionalComponent(CompactHeader, 'CompactHeader');
