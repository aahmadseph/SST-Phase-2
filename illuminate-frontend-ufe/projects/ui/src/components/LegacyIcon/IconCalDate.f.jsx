/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconCalDate(fullProps) {
    return (
        <LegacyIcon
            {...fullProps}
            viewBox='0 0 24 24'
        >
            <path d='M22.1 1.5h-1.9V.8c0-.4-.3-.8-.8-.8-.4 0-.8.3-.8.8v.8H5.2V.8c0-.5-.3-.8-.7-.8-.4 0-.7.4-.8.8v.8H1.9C.8 1.5 0 2.3 0 3.4v18.7c0 1 .8 1.9 1.9 1.9h20.2c1 0 1.9-.8 1.9-1.9V3.4c0-1.1-.8-1.9-1.9-1.9zm.4 20.6c0 .2-.2.4-.4.4H1.9c-.2 0-.4-.2-.4-.4V7.5h21v14.6zm0-16.1h-21V3.4c0-.2.2-.4.4-.4h1.9v.8c0 .4.4.7.8.7s.7-.3.7-.7V3h13.5v.8c0 .4.3.8.8.8.4 0 .8-.3.8-.8V3h1.9c.2 0 .4.2.4.4V6z' />
            <path d='M6.3 16v-3.5H4.7c-.4 0-.7-.3-.7-.7s.3-.8.7-.8h1.5V9.5c0-.4.4-.7.8-.7s.7.3.7.7V11h3.5V9.5c0-.4.3-.8.8-.8.4 0 .8.3.8.8V11h3.5V9.5c0-.4.4-.7.8-.7s.7.3.7.7V11h1.5c.4 0 .7.4.7.8s-.3.7-.7.7h-1.5V16h1.5c.4 0 .8.3.8.7s-.3.7-.8.7h-1.5V19c0 .4-.4.7-.8.7s-.7-.3-.7-.7v-1.5h-3.5V19c0 .4-.4.7-.8.7s-.7-.3-.7-.7v-1.5H7.7V19c0 .4-.4.7-.8.7s-.7-.3-.7-.7v-1.5H4.7c-.4 0-.7-.4-.7-.8s.4-.7.7-.7h1.6zm1.4 0h3.5v-3.5H7.7V16zm5 0h3.5v-3.5h-3.5V16z' />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconCalDate, 'IconCalDate');
