import React from 'react';
import { modal } from 'style/config';
import { Box } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';

function WizardBody() {
    return (
        <Box
            overflowY='auto'
            paddingX={modal.paddingX}
            paddingY={5}
            flex={1}
            {...this.props}
        />
    );
}

export default wrapFunctionalComponent(WizardBody, 'WizardBody');
