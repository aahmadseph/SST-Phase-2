import { Box } from 'components/ui';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function InputMsg(fullProps) {
    return <Box {...fullProps} />;
}

InputMsg.defaultProps = {
    is: 'p',
    marginTop: 2,
    lineHeight: 'tight',
    fontSize: 'sm',
    color: 'gray'
};

export default wrapFunctionalComponent(InputMsg, 'InputMsg');
