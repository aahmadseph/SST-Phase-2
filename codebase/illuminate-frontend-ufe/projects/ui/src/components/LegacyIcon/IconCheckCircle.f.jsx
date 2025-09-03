/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconCheckCircle(fullProps) {
    return (
        <LegacyIcon
            {...fullProps}
            viewBox='0 0 24 24'
        >
            <circle
                cx='12'
                cy='12'
                r='12'
            />
            <path
                fill='#fff'
                d='M9.9 13.7l-2.1-2.1-1.3 1.3 3.4 3.5 7.6-7.5-1.3-1.3z'
            />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconCheckCircle, 'IconCheckCircle');
