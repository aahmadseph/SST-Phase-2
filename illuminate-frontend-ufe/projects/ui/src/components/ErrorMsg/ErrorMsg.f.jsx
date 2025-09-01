import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';

function ErrorMsg({ children, ...props }) {
    if (!children || children === '') {
        return null;
    }

    return (
        <Box
            {...props}
            children={children}
        />
    );
}

ErrorMsg.defaultProps = {
    is: 'p',
    fontSize: 'sm',
    marginBottom: '1em',
    lineHeight: 'tight',
    color: 'error',
    role: 'alert'
};

export default wrapFunctionalComponent(ErrorMsg, 'ErrorMsg');
