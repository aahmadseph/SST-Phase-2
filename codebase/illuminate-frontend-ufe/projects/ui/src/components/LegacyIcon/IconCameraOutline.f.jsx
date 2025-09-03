/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconCameraOutline(fullProps) {
    return (
        <LegacyIcon
            {...fullProps}
            viewBox='0 0 32 30'
            width='1.067em'
        >
            <path d='M29 30H3c-1.7 0-3-1.3-3-3V9c0-1.7 1.3-3 3-3h1.1c.8 0 1.4-.4 1.8-1.1l1.3-2.7C8 .8 9.3 0 10.9 0h10.3c1.5 0 2.9.8 3.6 2.2l1.3 2.7c.3.7 1 1.1 1.8 1.1H29c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3zM3 8c-.5 0-1 .4-1 1v18c0 .6.5 1 1 1h26c.6 0 1-.4 1-1V9c0-.6-.5-1-1-1h-1.1c-1.5 0-2.9-.8-3.6-2.2L23 3.1c-.3-.7-1-1.1-1.8-1.1H10.9c-.8 0-1.4.4-1.8 1.1L7.7 5.8C7 7.2 5.7 8 4.1 8H3z' />
            <path d='M16 25c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm0-14c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z' />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconCameraOutline, 'IconCameraOutline');
