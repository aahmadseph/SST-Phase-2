/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconPhone(fullProps) {
    return (
        <LegacyIcon
            {...fullProps}
            viewBox='0 0 24 24'
        >
            <path d='M19.2 12.8c-.9-.9-2.3-.9-3.1 0l-1.8 1.8c-.2.2-.5.2-.6 0l-4.2-4.2c-.2-.2-.2-.5 0-.6L11.2 8c.9-.9.9-2.3 0-3.1L7 .7C6.6.2 6.1 0 5.5 0S4.3.2 3.9.7L1.7 2.9C.6 3.9 0 5.3 0 6.8V7c0 1.1.4 2.3 1 3.2 3.5 5 7.8 9.3 12.8 12.8 1 .7 2.1 1 3.3 1 1.5 0 3-.6 4.1-1.7l2.2-2.2c.4-.4.6-.9.6-1.5v-.1c0-.6-.2-1.1-.6-1.5l-4.2-4.2zm2.9 6L19.9 21c-1.3 1.4-3.5 1.5-5 .5C10 18.2 5.8 14 2.5 9.2c-1.1-1.6-.9-3.7.5-5L5.2 2c.2-.2.5-.2.6 0L10 6.1c.1.1.1.2.1.3 0 .1 0 .2-.1.3L8.2 8.5c-.4.4-.7 1-.7 1.6 0 .6.2 1.2.7 1.6l4.2 4.2c.9.9 2.3.9 3.1 0l1.8-1.8c.2-.2.5-.2.6 0l4.2 4.2c.2.1.2.4 0 .5z' />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconPhone, 'IconPhone');
