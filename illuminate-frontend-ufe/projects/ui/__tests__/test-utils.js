/* eslint-disable indent */
// import { Global } from '@emotion/react';
// import globalStyles from '#ui/style/global';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import Constants from 'utils/framework/Constants';
import cookieHandler from 'store/Cookies';
import React from 'react';
import reducers from 'reducers/reducers';
import reduxActionWatch from 'redux-action-watch';
import thunk from 'redux-thunk';

let store = null;

const RootContext = ({ children }) => {
    if (store) {
        return (
            <Provider store={store}>
                <div id='test-container-with-redux-state'>
                    <div id='modal-root' />
                    {/* <Global styles={globalStyles}> */}
                    {children}
                    {/* </Global> */}
                </div>
            </Provider>
        );
    } else {
        return (
            <div id='test-container-without-redux-state'>
                <div id='modal-root' />
                {/* <Global styles={globalStyles}> */}
                {children}
                {/* </Global> */}
            </div>
        );
    }
};

const renderWithContext = (component, { redux: initialState } = {}) => {
    if (initialState) {
        const actionWatchMiddleware = reduxActionWatch.middleware(Constants.ACTION_WATCHER_STATE_NAME);
        const middlewares = [cookieHandler, actionWatchMiddleware, thunk];
        store = createStore(reducers, initialState, applyMiddleware(...middlewares));
    } else {
        store = null;
    }

    return render(component, { wrapper: RootContext });
};

const { mockServer } = global;

// re-export everything from @testing-library/react
export * from '@testing-library/react';

// override render method
export { renderWithContext as render };

// re-export everything from 'msw'
export * from 'msw';

export { mockServer as server };
