/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconWait(fullProps) {
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
                d='M16.3 16.4c-.2-1.8-1.3-3.4-3-4.3l-.1-.1.1-.1c1.7-.8 2.8-2.4 3-4.3.7-.1 1.2-.8 1.2-1.6 0-.9-.6-1.6-1.4-1.6H7.9c-.7 0-1.4.7-1.4 1.6 0 .8.5 1.5 1.1 1.6.2 1.8 1.3 3.4 3 4.3l.1.1-.1.1c-1.7.8-2.8 2.4-3 4.3-.6.1-1.1.8-1.1 1.6 0 .9.6 1.6 1.4 1.6h8.2c.8 0 1.4-.7 1.4-1.6 0-.8-.5-1.5-1.2-1.6zM7.5 6c0-.3.2-.5.5-.5h8.2c.3 0 .5.2.5.5s-.2.5-.5.5H7.9c-.2 0-.4-.2-.4-.5zm3.9 6.9c.4-.2.6-.5.6-.9s-.2-.7-.6-.9c-1.3-.7-2.3-2-2.5-3.5h6.2c-.2 1.5-1.1 2.8-2.5 3.5-.4.2-.6.5-.6.9s.2.7.6.9c1.3.7 2.3 2 2.5 3.5H8.9c.2-1.5 1.1-2.9 2.5-3.5zm4.7 5.6H7.9c-.3 0-.5-.2-.5-.5s.2-.5.5-.5H16c.3 0 .5.2.5.5s-.2.5-.4.5z'
            />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconWait, 'IconWait');
