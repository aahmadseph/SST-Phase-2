/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconCamera(fullProps) {
    return (
        <LegacyIcon
            {...fullProps}
            viewBox='0 0 32 29'
            width='1.125em'
        >
            <path d='M1.142 6.7h1.3c1.7 0 3.3-.9 4.1-2.5l1.5-3c.4-.8 1.2-1.2 2-1.2h11.8c.9 0 1.7.5 2 1.2l1.5 3c.8 1.5 2.3 2.5 4.1 2.5h1.3c.6 0 1.1.5 1.1 1.1v20.1c0 .6-.5 1.1-1.1 1.1h-29.6c-.6 0-1.1-.5-1.1-1.1V7.8c0-.6.5-1.1 1.1-1.1zm14.9 19c5 0 9.1-4 9.1-8.9s-4.1-8.9-9.1-8.9-9.1 4-9.1 8.9 4 8.9 9.1 8.9zm0-15.7c3.8 0 6.9 3 6.9 6.7s-3.1 6.7-6.9 6.7-6.9-3-6.9-6.7 3.1-6.7 6.9-6.7z' />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconCamera, 'IconCamera');
