import { Box } from 'components/ui';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function Icon(props) {
    return (
        <Box
            {...props}
            is='svg'
        />
    );
}

Icon.defaultProps = {
    display: 'inline-block',
    width: '1em',
    height: '1em',
    position: 'relative',
    verticalAlign: 'text-bottom',
    fill: 'currentColor',
    flexShrink: 0,
    ['aria-hidden']: true
};

export default wrapFunctionalComponent(Icon, 'Icon');
