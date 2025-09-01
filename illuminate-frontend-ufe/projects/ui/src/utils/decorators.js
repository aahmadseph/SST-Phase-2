import Authentication from 'utils/Authentication';
import userUtils from 'utils/User';
import Actions from 'actions/Actions';
import IntersticeRequestActions from 'actions/IntersticeRequestActions';
import ErrorConstants from 'utils/ErrorConstants';
import RCPSCookies from 'utils/RCPSCookies';

import store from 'store/Store';
import watch from 'redux-watch';

const { getUser, PROFILE_STATUS } = userUtils;

function decorateWithCollectStateUpdatesFeature(decoratedComponentInstance) {
    const originalSetState = decoratedComponentInstance.setState;

    decoratedComponentInstance.collectState = function (state) {
        if (!this._collectedState) {
            this._collectedState = {};
        }

        this._collectedState = Object.assign({}, this._collectedState, state);
    };

    decoratedComponentInstance.setState = function (state) {
        const stateToSet = Object.assign({}, this._collectedState, state);
        originalSetState.call(this, stateToSet);
    };
}

/*
    DEPRECATED
    Use hocs/withEnsureUserIsSignedIn instead
*/
function ensureUserIsSignedIn(DecoratedComponent, isRecognizedAllowed = false) {
    const originalCtrlr = DecoratedComponent.prototype.ctrlr;
    const ctrlrAsync = DecoratedComponent.prototype.ctrlrAsync;

    // This is needed to prevent developers from even trying to rely on the
    // underlying state property.
    const isUserAuthenticatedKey = `_${Math.round(Math.random() * 1000000)}_isUserAuthenticated`;

    DecoratedComponent.prototype.isDecorated = true;
    DecoratedComponent.prototype.originalCtrlr = originalCtrlr;

    DecoratedComponent.prototype.ctrlr = function () {
        // This decoration here is needed for performance reasons.
        // If we used setState to set _isUserAuthenticated below, it would cause
        // a render. Then, `originalCtlr.call(this, user)` following it is going
        // to set the state by its design and cause another render. So, with the
        // setState approach, by using setState twie, we would end up having two
        // renders. This is exactly what we're trying to avoid.
        decorateWithCollectStateUpdatesFeature(this);

        //listen for user updates and recall original ctrl when user Logged in after
        // he get 401 from EPS woody call and 403 from refresh token call
        if (RCPSCookies.isRCPSFullProfileGroup()) {
            store.subscribe(
                watch(
                    store.getState,
                    'auth'
                )((newData, prevData) => {
                    if (
                        userUtils.PROFILE_STATUS.RECOGNIZED_STATUSES.includes(prevData.profileStatus) &&
                        newData.profileStatus === PROFILE_STATUS.LOGGED_IN
                    ) {
                        rememberUserIsAuthenticatedAndInvokeOriginalController.call(this, newData);
                    }
                }),
                this
            );
        }

        const rememberUserIsAuthenticatedAndInvokeOriginalController = user => {
            let done;
            const finish = new Promise(resolve => {
                done = resolve;
            });

            this.collectState({ [isUserAuthenticatedKey]: true });

            if (ctrlrAsync) {
                ctrlrAsync.call(this, user, done);
            } else {
                originalCtrlr.call(this, user);
                done();
            }

            // For the ctrlrAsync to continue the `done` is passed to it.
            // That `done` is exactly what's finishes the decorator work. For
            // the regular synchronous `ctrlr` the `done` is called
            // automatically in the implicit manner above.
            finish.then(() => {
                // There was no setState in the original component, but we still
                // need the _isUserAuthenticated to end in the state, so we're
                // setting it here purposely.
                if (this.state[isUserAuthenticatedKey] === undefined) {
                    this.setState({});
                }
            });
        };

        const authenticationMethod = isRecognizedAllowed
            ? Authentication.requireRecognizedAuthentication
            : Authentication.requireLoggedInAuthentication;

        authenticationMethod()
            .then(() => {
                // TODO 17.4 mykhaylo.gavrylyuk: Figure out why the user is not
                // present right after the authentication and remove the 2nd level.
                getUser().then(user => {
                    rememberUserIsAuthenticatedAndInvokeOriginalController.call(this, user);
                });
            })
            .catch(() => {
                // NOTE mykhaylo.gavrylyuk: We may need to analize reasons for
                // failure at some future point to make components familiar with
                // them in order to render differently.
                // THIS IS THE VERY PLACE FOR DOING THAT!

                this.collectState({ [isUserAuthenticatedKey]: false });

                this.ctrlrForNotSignedIn();

                // For the same purpose described above.
                if (this.state[isUserAuthenticatedKey] === undefined) {
                    this.setState({});
                }

                const userWatch = watch(store.getState, 'user');
                store.subscribe(
                    userWatch(newUser => {
                        if (newUser.profileId) {
                            rememberUserIsAuthenticatedAndInvokeOriginalController.call(this, newUser);
                        }
                    }),
                    this
                );
            });
    };

    const isAuthenticatedMethod = isRecognizedAllowed ? 'isUserAtleastRecognized' : 'isUserAuthenticated';

    // NOTE! This method should always be used in conjunction with
    // #isUserReady(), as because if the user is not ready, it will look like
    // she's not authenticated, which is not true, because she's just not yet
    // arrived.
    DecoratedComponent.prototype[isAuthenticatedMethod] = function () {
        return this.state[isUserAuthenticatedKey] === true;
    };

    DecoratedComponent.prototype.isUserReady = function () {
        // It is safe to use this property here too as once the user is ready,
        // it's value will be either true, or false. And this way we don't need
        // to introduce another property on the state, which is good.
        return typeof this.state[isUserAuthenticatedKey] === 'boolean';
    };

    // If there's ever a need to set state on component for the case
    // when user is not authenticated, this is the right place.
    // Please overwrite this dummy method on your components.
    DecoratedComponent.prototype.ctrlrForNotSignedIn = function () {};

    return DecoratedComponent;
}

function ensureUserIsAtLeastRecognized(DecoratedComponent) {
    return ensureUserIsSignedIn(DecoratedComponent, true);
}

function requireSignedInUser(DecoratedComponent) {
    const originalCtrlr = DecoratedComponent.prototype.ctrlr;

    DecoratedComponent.prototype.ctrlr = function () {
        getUser().then(user => {
            originalCtrlr.call(this, user);
        });
    };

    return DecoratedComponent;
}

// The purpose of this decorator is to make showing/hiding the interstice
// as easy as wrapping the related api call.
//
// It is supposed to be leveraged with the use of `withInterstice` morphem
// in the code:
//
// > withInterstice(checkoutApi.getOrderDetails, 500)(orderId)
//
// The second argument is the timeout in ms to allow before showing the interstice.
// If request gets finished during the timeout, the interstice is not shown at all.
//
// The third argument is in case there are multiple simultaneous requests, in which case
// a duration needs to be passed in, otherwise there will be flickering inbetween interstices
// of various requests.  Recommended minimum is 100ms, because even 1ms will cause flickering.

let requestListWatcher;

function decorateApiCallWithInterstice(
    method,
    delayIntersticeMs = ErrorConstants.INTERSTICE_DEFAULT_TIMEOUT_MS,
    minIntersticeDurationMs = ErrorConstants.INTERSTICE_DEFAULT_TIMEOUT_MS
) {
    return (...args) => {
        const requestId = (Math.random() * 1000).toString();

        if (!requestListWatcher) {
            requestListWatcher = watch(store.getState, 'intersticeRequests');
            const unsubscribe = store.subscribe(
                requestListWatcher(request => {
                    if (request.requestList.length === 0) {
                        store.dispatch(Actions.showInterstice(false));
                        unsubscribe();
                        requestListWatcher = null;
                    }
                }),
                { ignoreAutoUnsubscribe: true }
            );
        }

        setTimeout(() => {
            const requestList = store.getState().intersticeRequests.requestList;

            if (requestList.indexOf(requestId) !== -1) {
                store.dispatch(Actions.showInterstice(true));
            }
        }, delayIntersticeMs);

        store.dispatch(IntersticeRequestActions.add(requestId));

        const promise = method(...args)
            .then(data => {
                setTimeout(() => {
                    store.dispatch(IntersticeRequestActions.remove(requestId));
                }, minIntersticeDurationMs);

                return Promise.resolve(data);
            })
            .catch(reason => {
                setTimeout(() => {
                    store.dispatch(IntersticeRequestActions.remove(requestId));
                }, minIntersticeDurationMs);

                return Promise.reject(reason);
            });

        return promise;
    };
}

export default {
    ensureUserIsAtLeastRecognized,
    ensureUserIsSignedIn,
    requireSignedInUser,
    decorateApiCallWithInterstice,
    withInterstice: decorateApiCallWithInterstice
};
