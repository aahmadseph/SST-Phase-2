import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { modal } from 'style/config';
import { Flex } from 'components/ui';

const WizardSubhead = function (props) {
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
            {...props}
        />
    );
};

export default wrapFunctionalComponent(WizardSubhead, 'WizardSubhead');
