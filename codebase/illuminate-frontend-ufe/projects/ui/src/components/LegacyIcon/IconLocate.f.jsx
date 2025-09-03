/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconLocate(fullProps) {
    return (
        <LegacyIcon
            {...fullProps}
            viewBox='5 2 14 20'
            width='.75em'
        >
            <path d='M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z' />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconLocate, 'IconLocate');
