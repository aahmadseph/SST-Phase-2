import React from 'react';
import { Global } from '@emotion/react';
import globalStyles from 'style/global';
import Framework from 'utils/framework';

const withEmotionGlobal = Framework.wrapHOC(function withEmotionGlobal(WrappedComponent) {
    const EmotionGlobalProvider = props => (
        <>
            <Global styles={globalStyles} />
            <WrappedComponent {...props} />
        </>
    );

    // Arguments are needed to support passing from higher level: @see withRootComponentProps
    return Framework.wrapHOCComponent(EmotionGlobalProvider, 'EmotionGlobalProvider', arguments);
});

export default withEmotionGlobal;
