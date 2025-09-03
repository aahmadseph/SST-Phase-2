/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconCalAdd(fullProps) {
    return (
        <LegacyIcon
            {...fullProps}
            viewBox='0 0 24 24'
        >
            <path d='M22.1 1.5h-1.9V.8c0-.4-.3-.8-.8-.8s-.8.3-.8.8v.8H5.2V.8c0-.5-.3-.8-.7-.8s-.7.3-.7.8v.8H1.9C.8 1.5 0 2.3 0 3.4v18.7c0 1 .8 1.9 1.9 1.9h20.2c1 0 1.9-.8 1.9-1.9V3.4c0-1.1-.8-1.9-1.9-1.9zm.4 20.6c0 .2-.2.4-.4.4H1.9c-.2 0-.4-.2-.4-.4V7.5h21v14.6zm0-16.1h-21V3.4c0-.2.2-.4.4-.4h1.9v.8c0 .4.3.8.8.8s.8-.3.8-.8V3h13.5v.8c0 .4.3.8.8.8s.8-.3.8-.8V3h1.9c.2 0 .4.2.4.4V6z' />
            <path d='M7.7 15.7c0 .1 0 .1 0 0h3.5v3.5c0 .4.3.7.7.7.4 0 .7-.3.7-.7v-3.5h3.5c.4 0 .8-.3.8-.7 0-.4-.3-.8-.7-.8h-3.6v-3.5c0-.4-.3-.8-.7-.8-.4 0-.8.3-.8.7v3.6H7.8c-.5 0-.8.4-.8.8s.3.7.7.7z' />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconCalAdd, 'IconCalAdd');
