/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconCalResched(fullProps) {
    return (
        <LegacyIcon
            {...fullProps}
            viewBox='0 0 24 24'
        >
            <path d='M22.1 1.5h-1.9V.8c0-.4-.3-.8-.8-.8s-.8.3-.8.8v.8H5.2V.8c0-.5-.3-.8-.7-.8s-.7.3-.7.8v.8H1.9C.8 1.5 0 2.3 0 3.4v18.7c0 1 .8 1.9 1.9 1.9h20.2c1 0 1.9-.8 1.9-1.9V3.4c0-1.1-.8-1.9-1.9-1.9zm.4 20.6c0 .2-.2.4-.4.4H1.9c-.2 0-.4-.2-.4-.4V7.5h21v14.6zm0-16.1h-21V3.4c0-.2.2-.4.4-.4h1.9v.8c0 .4.3.8.8.8s.8-.3.8-.8V3h13.5v.8c0 .4.3.8.8.8s.8-.3.8-.8V3h1.9c.2 0 .4.2.4.4V6z' />
            <path d='M10.3 20.7c.5.2 1.1.3 1.7.3.8 0 1.5-.2 2.2-.5 1.2-.6 2.1-1.7 2.6-2.9.4-1.3.4-2.7-.2-3.9-.9-2-3-3.1-5.1-2.9l.4-.8c.1-.2.1-.3.1-.5s-.2-.3-.3-.4c-.3-.2-.7-.1-.9.2l-1.1 2.2s-.2.3-.1.5c0 .1.1.2.3.3l2.1 1.2c.1.1.2.1.3.1.2 0 .5-.2.6-.3.1-.2.1-.3.1-.5s-.2-.3-.3-.4l-.8-.4c1.4 0 2.7.8 3.4 2.1.4.9.5 2 .2 2.9-.3.9-1 1.7-1.9 2.1-.9.4-1.9.5-2.8.2-.9-.3-1.7-1-2.1-1.9-.4-.9-.5-1.9-.2-2.9.1-.4-.1-.7-.4-.9-.3-.1-.7.1-.8.5-.4 1.3-.4 2.7.2 3.9.6 1.3 1.6 2.2 2.8 2.7z' />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconCalResched, 'IconCalResched');
