import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { modal } from 'style/config';
import { Box } from 'components/ui';

const WizardBody = function (props) {
    return (
        <Box
            overflowY='auto'
            paddingX={modal.paddingX}
            paddingY={5}
            flex={1}
            {...props}
        />
    );
};

export default wrapFunctionalComponent(WizardBody, 'WizardBody');
