import React from 'react';
import { modal } from 'style/config';
import { Flex } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';

function WizardSubhead() {
    return (
        <Flex
            position='relative'
            flexDirection='column'
            justifyContent='center'
            height='4em'
            lineHeight='tight'
            paddingX={modal.paddingX}
            flexShrink={0}
            fontSize='md'
            boxShadow='0 2px 8px 0 rgba(0, 0, 0, 0.1)'
            {...this.props}
        />
    );
}

export default wrapFunctionalComponent(WizardSubhead, 'WizardSubhead');
