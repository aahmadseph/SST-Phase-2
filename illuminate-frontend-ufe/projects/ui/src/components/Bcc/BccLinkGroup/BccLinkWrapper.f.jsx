import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';
import BccLink from 'components/Bcc/BccLink/BccLink';
import BccBase from 'components/Bcc/BccBase/BccBase';

const BccLinkWrapper = props => {
    const { linkIndex } = props;
    const pad = Sephora.isMobile() ? 'container' : null;

    return (
        <BccBase {...props}>
            <Box
                key={linkIndex}
                lineHeight='tight'
                marginLeft={pad}
                borderTop={linkIndex > 0 && 1}
                borderColor='divider'
            >
                <BccLink
                    {...props}
                    arrowPosition='after'
                    arrowDirection='right'
                    hasFloatingArrow={true}
                    paddingY={4}
                    paddingX={pad}
                    marginLeft={pad ? `-${pad}` : null}
                />
            </Box>
        </BccBase>
    );
};

export default wrapFunctionalComponent(BccLinkWrapper, 'BccLinkWrapper');
