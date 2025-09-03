/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconYoutube(fullProps) {
    return (
        <LegacyIcon
            {...fullProps}
            viewBox='0 95 112.5 112.5'
        >
            <path d='M105.3 131.2s-.9-6.8-4-9.9c-3.8-4-8.1-4-10-4.2-14-1.1-34.9-1.1-34.9-1.1s-20.9 0-34.9 1.1c-2 .2-6.2.2-10 4.2-3.2 3.1-4.1 9.9-4.1 9.9s-1.1 8.1-1.1 16.2v7.6c0 8.1 1.1 16.2 1.1 16.2s.9 6.8 4 9.9c3.8 4 8.8 3.9 11.1 4.3 8 .7 34 1.1 34 1.1s21.1 0 35.1-1.1c2-.2 6.2-.2 10-4.2 2.9-3.1 4-9.9 4-9.9s.8-8.2.8-16.3v-7.6c-.2-8.1-1.1-16.2-1.1-16.2zm-59.4 32.9V136L73 150.1l-27.1 14z' />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconYoutube, 'IconYoutube');
