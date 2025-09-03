/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconCross(fullProps) {
    const { x, ...props } = fullProps;

    return (
        <LegacyIcon
            viewBox='0 0 17 17'
            baseCss={
                x && {
                    transform: 'rotate(45deg)'
                }
            }
            {...props}
        >
            <path d='M17 7.5H9.5V0h-2v7.5H0v2h7.5V17h2V9.5H17' />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconCross, 'IconCross');
