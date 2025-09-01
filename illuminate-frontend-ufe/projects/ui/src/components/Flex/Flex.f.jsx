import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import Box from 'components/Box';

const Flex = React.forwardRef((props, ref) => {
    return (
        <Box
            ref={ref}
            {...props}
        />
    );
});

Flex.defaultProps = {
    display: 'flex'
};

export default wrapFunctionalComponent(Flex, 'Flex');
