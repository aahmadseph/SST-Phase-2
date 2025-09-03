/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconDirections(fullProps) {
    return (
        <LegacyIcon
            {...fullProps}
            viewBox='0 0 24 24'
        >
            <path d='M23.5 10.7L13.3.5C13 .2 12.5 0 12 0s-1 .2-1.3.5L.5 10.7c-.7.7-.7 1.9 0 2.7l10.1 10.1c.4.3.9.5 1.4.5.5 0 1-.2 1.3-.5l10.1-10.1c.8-.8.8-2 .1-2.7zm-1.1 1.6L12.3 22.4c-.1.1-.2.1-.3.1-.1 0-.2 0-.3-.1L1.6 12.3c-.1-.1-.1-.4 0-.5L11.7 1.6c.1-.1.2-.1.3-.1.1 0 .2 0 .3.1l10.1 10.1c.1.2.1.4 0 .6z' />
            <path d='M16.4 9.5c0-.1-.1-.2-.2-.2l-3-3c-.1-.2-.3-.3-.4-.3-.2 0-.4.1-.5.2-.3.3-.3.8 0 1.1L13.9 9h-.8c-2.7 0-4.9 2.2-4.9 4.9V15c0 .4.3.7.8.7.4 0 .7-.3.7-.7v-1.1c0-1.9 1.5-3.4 3.4-3.4h.8l-1.7 1.7c-.3.3-.3.8 0 1.1.1.1.3.2.5.2s.4-.1.5-.2l3-3c.1-.1.1-.1.1-.2s.1-.2.1-.3c.1-.1.1-.2 0-.3z' />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconDirections, 'IconDirections');
