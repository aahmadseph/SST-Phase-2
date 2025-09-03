import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Framework from 'utils/framework';

const withRootComponentProps = compose(
    Framework.wrapHOC(connect(({ ssrProps }) => ({ ssrProps }))),
    Framework.wrapHOC((WrappedComponent, displayName) => {
        function RootComponentProps({ ssrProps, ...restProps }) {
            const props = ssrProps[displayName];

            return (
                <WrappedComponent
                    {...props}
                    {...restProps}
                />
            );
        }

        return Framework.wrapHOCComponent(RootComponentProps, 'RootComponentProps', [WrappedComponent, displayName]);
    })
);

export default withRootComponentProps;
