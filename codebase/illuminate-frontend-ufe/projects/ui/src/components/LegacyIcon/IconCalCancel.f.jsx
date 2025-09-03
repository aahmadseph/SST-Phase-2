/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconCalCancel(fullProps) {
    return (
        <LegacyIcon
            {...fullProps}
            viewBox='0 0 24 24'
        >
            <path d='M22.1 1.5h-1.9V.8c0-.4-.3-.8-.8-.8s-.8.3-.8.8v.8H5.2V.8c0-.5-.3-.8-.7-.8s-.7.3-.7.8v.8H1.9C.8 1.5 0 2.3 0 3.4v18.7c0 1 .8 1.9 1.9 1.9h20.2c1 0 1.9-.8 1.9-1.9V3.4c0-1.1-.8-1.9-1.9-1.9zm.4 20.6c0 .2-.2.4-.4.4H1.9c-.2 0-.4-.2-.4-.4V7.5h21v14.6zm0-16.1h-21V3.4c0-.2.2-.4.4-.4h1.9v.8c0 .4.3.8.8.8s.8-.3.8-.8V3h13.5v.8c0 .4.3.8.8.8s.8-.3.8-.8V3h1.9c.2 0 .4.2.4.4V6z' />
            <path d='M8.4 18.5c.3.3.8.3 1.1 0L12 16l2.5 2.5c.3.3.8.3 1.1 0 .3-.3.3-.8 0-1.1L13.1 15l2.5-2.5c.3-.3.3-.8 0-1.1-.3-.3-.8-.3-1.1 0L12 13.9l-2.5-2.5c-.3-.3-.8-.3-1.1 0-.3.3-.3.8 0 1.1l2.5 2.5-2.5 2.5c-.2.3-.2.7 0 1z' />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconCalCancel, 'IconCalCancel');
