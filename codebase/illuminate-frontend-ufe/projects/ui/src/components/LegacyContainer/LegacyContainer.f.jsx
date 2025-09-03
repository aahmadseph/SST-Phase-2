import React from 'react';
import { Box } from 'components/ui';
import { site } from 'style/config';
import { wrapFunctionalComponent } from 'utils/framework';

function LegacyContainer(fullProps) {
    const isDesktop = Sephora.isDesktop();

    return (
        <Box
            baseCss={{
                boxSizing: isDesktop ? 'content-box' : 'border-box',
                width: isDesktop ? site.legacyWidth : '100%'
            }}
            {...fullProps}
        />
    );
}

LegacyContainer.defaultProps = {
    display: 'flex',
    flexDirection: 'column',
    marginX: 'auto',
    paddingX: 'container'
};

export default wrapFunctionalComponent(LegacyContainer, 'LegacyContainer');
