/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconChatAlt(fullProps) {
    return (
        <LegacyIcon
            {...fullProps}
            viewBox='0 0 23 20'
            width='1.15em'
        >
            <path d='M4.12 8.186C1.69 9.146 0 11.284 0 13.77c0 1.662.76 3.17 1.99 4.273-.49.716-1.084 1.275-1.91 1.583.463.173.854.268 1.376.268.856 0 1.652-.254 2.318-.69.966.44 2.063.69 3.227.69 2.91 0 5.407-1.554 6.463-3.765-4.972-.096-9.022-3.575-9.342-7.945zm17.967 6.57c-1.004-.376-1.726-1.056-2.322-1.927 1.496-1.344 2.42-3.18 2.42-5.203 0-4.116-3.814-7.453-8.518-7.453C8.963.174 5.15 3.51 5.15 7.627s3.813 7.453 8.517 7.453c1.417 0 2.75-.303 3.926-.838.81.53 1.78.84 2.82.84.636 0 1.112-.117 1.674-.327z' />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconChatAlt, 'IconChatAlt');
