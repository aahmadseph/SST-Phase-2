/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconLock(fullProps) {
    return (
        <LegacyIcon
            {...fullProps}
            viewBox='0 0 11 17'
            width='0.65em'
        >
            <path d='M3 6.5V3.4C3 2.1 4.1 1 5.5 1S8 2.1 8 3.4v3.1c0 .3.2.5.5.5s.5-.2.5-.5V3.4C9 1.5 7.4 0 5.5 0S2 1.5 2 3.4v3.1c0 .3.2.5.5.5s.5-.2.5-.5zM9.8 7H1.2C.6 7 0 7.6 0 8.3v7.4c0 .7.6 1.3 1.2 1.3h8.5c.7 0 1.2-.6 1.2-1.3V8.3C11 7.6 10.4 7 9.8 7zm.2 8.7c0 .1-.1.3-.2.3H1.2c-.1 0-.2-.1-.2-.3V8.3c0-.1.1-.3.2-.3h8.5c.1 0 .2.1.2.3v7.4z' />
            <path d='M5.5 10c-.3 0-.5.3-.5.6v2.9c0 .2.2.5.5.5s.5-.3.5-.6v-2.9c0-.2-.2-.5-.5-.5z' />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconLock, 'IconLock');
