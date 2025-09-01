/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconPlay(fullProps) {
    const { isPause, ...props } = fullProps;

    return (
        <LegacyIcon
            {...props}
            viewBox='0 0 32 32'
        >
            {isPause ? (
                <React.Fragment>
                    <path d='M16 0C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16S24.8 0 16 0zm0 30C8.3 30 2 23.7 2 16S8.3 2 16 2s14 6.3 14 14-6.3 14-14 14z' />
                    <path d='M13.2 10H11c-.6 0-1.1.5-1.1 1.3v9.5c0 .8.5 1.2 1.1 1.2h2.2c.6 0 1.1-.4 1.1-1.2v-9.5c0-.8-.5-1.3-1.1-1.3zM21.2 10H19c-.6 0-1.1.5-1.1 1.3v9.6c0 .8.5 1.1 1.1 1.1h2.2c.6 0 1.1-.3 1.1-1.1v-9.6c0-.8-.5-1.3-1.1-1.3z' />
                </React.Fragment>
            ) : (
                <path d='M16 32C7.2 32 0 24.8 0 16S7.2 0 16 0s16 7.2 16 16-7.2 16-16 16zm0-30C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2zm-2.5 20.6c-.2 0-.5-.1-.7-.2-.5-.3-.8-.8-.8-1.3V10.9c0-.5.3-1.1.8-1.3.5-.3 1.1-.2 1.5 0l8 5.1c.4.3.7.8.7 1.3s-.3 1-.7 1.3l-8 5.1c-.2.1-.5.2-.8.2z' />
            )}
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconPlay, 'IconPlay');
