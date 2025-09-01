import React from 'react';

const withClientSideRenderOnly = () => WrappedComponent => {
    const WithClientSideRenderOnly = function (props) {
        if (Sephora.isNodeRender) {
            return null;
        } else {
            return <WrappedComponent {...props} />;
        }
    };

    const wrappedName = WrappedComponent.displayName || WrappedComponent.class;
    WithClientSideRenderOnly.prototype.class = `WithClientSideRenderOnly-${wrappedName}`;
    WithClientSideRenderOnly.class = `WithClientSideRenderOnly-${wrappedName}`;
    WithClientSideRenderOnly.displayName = `WithClientSideRenderOnly(${wrappedName})`;

    return WithClientSideRenderOnly;
};

export default withClientSideRenderOnly;
