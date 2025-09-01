import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;
import PreviewSettingsContent from 'components/PreviewSettings';

const PreviewSettings = () => {
    return (
        <div
            /* set height on root component wrapper
            since we can’t style it directly */
            css={{ '&, & > div': { height: '100%' } }}
        >
            <PreviewSettingsContent />
        </div>
    );
};

export default wrapFunctionalComponent(PreviewSettings, 'PreviewSettings');
