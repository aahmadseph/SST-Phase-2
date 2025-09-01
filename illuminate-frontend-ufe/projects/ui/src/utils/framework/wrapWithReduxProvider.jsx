import React from 'react';
import { Provider } from 'react-redux';
import Framework from 'utils/framework';
import store from 'Store';

const withReduxProvider = Framework.wrapHOC(function withReduxProvider(WrappedComponent) {
    const ReduxProvider = props => (
        <Provider store={store}>
            <WrappedComponent {...props} />
        </Provider>
    );

    return Framework.wrapHOCComponent(ReduxProvider, 'ReduxProvider', arguments);
});

export default withReduxProvider;
