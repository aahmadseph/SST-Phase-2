import React from 'react';
import PATHS from './paths';
import { Box } from 'components/ui';

const EDPIcon = ({ name }) => {
    const iconPath = PATHS[name];

    if (!iconPath) {
        return (
            <Box
                width={[24, null, 32]}
                height={[24, null, 32]}
            />
        );
    }

    return (
        <Box
            is='svg'
            width={[24, null, 32]}
            height={[24, null, 32]}
            viewBox='0 0 32 32'
            fill='none'
            children={iconPath}
        />
    );
};

export default EDPIcon;
