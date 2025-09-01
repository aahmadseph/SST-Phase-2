import React, { Suspense } from 'react';
import Interstice from 'components/Interstice/Interstice';

const withSuspenseLoadHoc = WrappedComponent => {
    const SuspenseWrapper = props => (
        <Suspense fallback={<Interstice />}>
            <WrappedComponent {...props} />
        </Suspense>
    );

    SuspenseWrapper.displayName = `withSuspenseLoad(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return SuspenseWrapper;
};

export default withSuspenseLoadHoc;
