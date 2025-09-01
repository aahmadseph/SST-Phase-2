/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconShare(fullProps) {
    return (
        <LegacyIcon
            {...fullProps}
            viewBox='0 0 24 24'
        >
            <path d='M22.6 10.3c-.4 0-.8.4-.8.8V22c0 .2-.2.4-.4.4H2.5c-.2 0-.4-.2-.4-.4V11.1c0-.4-.4-.8-.8-.8s-.8.4-.8.8V22c0 1.1.9 2 2 2h18.9c1.1 0 2-.9 2-2V11.1c0-.5-.3-.8-.8-.8z' />
            <path d='M5.8 6.6c.3.3.8.3 1.1 0l4.3-4v14.9c0 .4.4.8.8.8s.8-.3.8-.8V2.6l4.3 4c.2.1.4.2.6.2.2 0 .4-.1.6-.2.3-.3.3-.7 0-1L12.7.3c-.3-.3-.8-.3-1.1 0L5.8 5.6c-.3.2-.3.7 0 1z' />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconShare, 'IconShare');
