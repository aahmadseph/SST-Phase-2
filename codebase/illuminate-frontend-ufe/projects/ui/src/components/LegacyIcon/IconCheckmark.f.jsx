/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconCheckmark(fullProps) {
    return (
        <LegacyIcon
            {...fullProps}
            viewBox='0 0 11 8'
            width='1.375em'
        >
            <path d='M1.3 3.6L0 4.8 3.4 8 11 1.2 9.7 0 3.4 5.6' />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconCheckmark, 'IconCheckmark');
