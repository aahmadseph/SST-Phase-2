import React from 'react';
import { Box } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';
import typography from 'style/typography';

function Html({ content, ...props }) {
    return (
        <Box
            dangerouslySetInnerHTML={{ __html: content }}
            baseCss={typography}
            {...props}
        />
    );
}

export default wrapFunctionalComponent(Html, 'Html');
