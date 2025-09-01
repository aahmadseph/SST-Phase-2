/* eslint-disable no-console */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from 'reducers/reducers';
import watch from 'redux-watch';
import objectPath from 'object-path';
import helpers from 'utils/Helpers';
import reduxActionWatch from 'redux-action-watch';
import Constants from 'utils/framework/Constants';
import cookieHandler from 'store/Cookies';
import { STORE_INITIALISATION } from 'constants/actionTypes/application';
import { MERGE_PAGE_DATA } from 'constants/actionTypes/page';
import { isUfeEnvLocal, isUfeEnvQA } from 'utils/Env';
import loggerMiddleware from 'store/loggerMiddleware';
import RCPSCookies from 'utils/RCPSCookies';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import AuthActions from 'actions/AuthActions';
import { updateBasket } from 'actions/RwdBasketActions';
import AuthenticationUtils from 'utils/Authentication';

const initialStore = {};

const isObject = helpers.isObject;
const getValue = objectPath.get;

const actionWatchMiddleware = reduxActionWatch.middleware(Constants.ACTION_WATCHER_STATE_NAME);

const middlewares = [cookieHandler, actionWatchMiddleware, thunk];

if ((isUfeEnvLocal || isUfeEnvQA) && !Sephora.isNodeRender) {
    middlewares.unshift(loggerMiddleware);
}

const store = createStore(reducers, initialStore, applyMiddleware(...middlewares));

store.initialize = async () => {
    const UserActions = (await import('actions/UserActions')).default;
    const Actions = (await import('actions/Actions')).default;

    if (!Sephora.isNodeRender) {
        const initialStoreElement = document.body.querySelector('#linkStore');

        if (initialStoreElement) {
            const { page: payload, ssrProps } = JSON.parse(initialStoreElement.innerHTML);
            const options = { disableDispatchWarning: true };
            store.dispatch(
                {
                    type: STORE_INITIALISATION,
                    payload: { ssrProps }
                },
                options
            );

            store.dispatch(
                {
                    type: MERGE_PAGE_DATA,
                    payload
                },
                options
            );

            if (RCPSCookies.isRCPSAuthEnabled()) {
                //if user needs to be sign out immediately on page reload (was logged in but tokens expired)
                if (Sephora.Util.RefreshToken.isSignOutOnInit) {
                    store.dispatch(UserActions.signOut());
                }

                const cachedProfileStatus = Storage.local.getItem(LOCAL_STORAGE.PROFILE_SECURITY_STATUS);
                const cachedBasket = Storage.local.getItem(LOCAL_STORAGE.BASKET);

                if (cachedBasket) {
                    store.dispatch(updateBasket({ newBasket: cachedBasket }));
                }

                //if profileSecurityStatus exist in localStorage on store init
                if (typeof cachedProfileStatus === 'number') {
                    store.dispatch(AuthActions.updateProfileStatus(cachedProfileStatus));
                }

                //listen for event to sign out user
                window.addEventListener('UserSignOut', ({ detail }) => {
                    const { xCausedHeader } = detail;
                    store.dispatch(UserActions.signOut(undefined, false, false, undefined, xCausedHeader));
                });

                //listen for event to update profileSecurityStatus in localStorage and store
                window.addEventListener('UpdateProfileStatus', ({ detail }) => {
                    AuthenticationUtils.updateProfileStatus(detail);
                });

                window.addEventListener('ResetUser', () => {
                    const errback = () => {
                        store.dispatch(UserActions.signOut());
                    };

                    store.dispatch(
                        Actions.showSignInModal({
                            isOpen: true,
                            errback
                        })
                    );
                });
            }
        }
    }
};

const originalDispatch = store.dispatch;
let suppresDispatchWarning = false;
store.dispatch = function (action, { disableDispatchWarning = false } = {}) {
    const warningEnabled = isWarningAllowed && !suppresDispatchWarning && !disableDispatchWarning;
    const hydrationMode = !Sephora.isNodeRender && !Sephora.Util.InflatorComps.services?.loadEvents?.HydrationFinished;

    if (warningEnabled && hydrationMode) {
        console.warn('It is not allowed to dispatch actions during hydration process.');
    }

    let result;

    if (action) {
        if (action instanceof Promise) {
            result = action.then(actionResult => originalDispatch.call(store, actionResult));
        } else {
            result = originalDispatch.call(store, action);
        }
    }

    return result;
};

const originalSubscribe = store.subscribe;

const isWarningAllowed = !Sephora.isNodeRender && Sephora.UFE_ENV === 'LOCAL';
let watchersQueue = [];
let handleStateQueue = [];

store.onHydrationFinished = () => {
    // set initial state
    for (const handleStateFn of handleStateQueue) {
        handleStateFn();
    }

    for (const queueItem of watchersQueue) {
        // if unsubscribe has already been called, no need to subscribe
        if (!queueItem.invoked) {
            queueItem.unsubscribeOrig = store.subscribe(queueItem.watcher, queueItem.component, true);
        }
    }

    watchersQueue = [];
    handleStateQueue = [];
};

const dummyUnsubscriber = function () {};

const initializeFrameworkFields = component => {
    if (!component) {
        return;
    }

    const { listeners = {}, unsubscribers = [], ...restProps } = component['__ufe__'] || {};
    component['__ufe__'] = {
        ...restProps,
        listeners,
        unsubscribers
    };
};

/**
 *
 * @param  {function} listener - The method to watch the changes of the store, it will be called
 * on every update of store that you watch
 *
 * @param  {object} component - you always need to pass your component as a second parameter
 * to let the framework automatically unsubscribe from your watcher on componentWillUnmount hook.
 * If you want to ignore automatic unsubscription, pass this flag as a second parameter like this:
 * store.subscribe(<your watcher>, { ignoreAutoUnsubscribe: true });
 *
 * @return {function} - returns a method to unsubscribe from the watcher.
 * Please note that store.subscribe will help you automatically unsubscribe your watcher on
 * componentWillUnmount hook. But you always can handle the unsubscription by yourself if needed,
 * for example if you want to unsubscribe immediately.
 *
 * store.subscribe returns a function which you call in order to remove the subscription,
 * so in this case you can unsubscribe from a given property like this:
 *
 * let unsubscribe = store.subscribe(<your watcher>, this);
 * unsubscribe();
 **/
store.subscribe = function (listener, component, fromSetAndWatch = false) {
    if (Sephora.isNodeRender) {
        console.error(
            'Store subscibe called server side. This subscription will be ignored. This should be replaced with setAndWatch STATE_STRATEGIES.DIRECT_INIT or STATE_STRATEGIES.CLIENT_SIDE_DATA.'
        );

        return dummyUnsubscriber;
    }

    const unsubscribe = originalSubscribe.call(store, listener);

    if (component) {
        if (!fromSetAndWatch && isWarningAllowed) {
            console.warn('Direct subscriptions to the store should be avoided. Please use setAndWatch instead.');
        }

        if (!component.ignoreAutoUnsubscribe) {
            initializeFrameworkFields(component);
            const { listeners, unsubscribers } = component['__ufe__'];
            listeners[listener] = { enable: true };
            unsubscribers.push(() => {
                listeners[listener].enable = false;
                unsubscribe();
            });
        }
    } else {
        console.warn(
            'You need to pass your component as a second parameter to ' +
                'store.subscribe or store.setAndWatch, ' +
                'otherwise there’s a risk to stay subscribed on the unmounted component.' +
                'If you want to ignore automatic unsubscription, please pass ' +
                '{ ignoreAutoUnsubscribe: true } as a second parameter to store.subscribe or store.setAndWatch'
        );
    }

    return unsubscribe;
};

const STATE_STRATEGIES = {
    NONE: 0, // never update component's state
    ALWAYS: 1, // always update component's state using component.setState()
    DIRECT_INIT: 2, // set initial component's state directly. For all subsequent updates use component.setState()
    CLIENT_SIDE_DATA: 3 // delay setting initial state and store subscriptions until hydration is finished
};

store.STATE_STRATEGIES = STATE_STRATEGIES;

/**
 *
 * @param  {string || object} properties - You can pass a string describing the store property
 * name that you're interacting with. This will get pattern-matched to a property of the same name
 * in your local state. Eg. store.setAndWatch('user', this, callbackForUserData);
 *
 * If you need a different name for your local state property, pass an object instead of a string
 * where the key name is the store property name, and the key value is the local state property
 * name. Eg. store.setAndWatch({ 'user': 'myUser' }, this, null, true);
 *
 * Forth parameter will let you to store the data right on component state.
 *
 * Please note: you always need to pass your component as a second parameter to let the framework
 * automatically unsubscribe from your watcher on componentWillUnmount hook.
 * If you want to ignore automatic unsubscription, pass this flag as a second parameter like this:
 * store.setAndWatch('user', { ignoreAutoUnsubscribe: true }, callbackForUserData);
 *
 * If you need to access a nested property you can look for it using dot notation.
 * Eg. store.setAndWatch('user.firstName', this, callback). If you pass as string it will use
 * the deepest property to name the local state property. You can pass as object to specify
 * the propert name too: store.setAndWatch({'user.firstName': 'userName'}, this, callback);
 *
 * You can pass multiple properties to setAndWatch together by passing inside an array. These
 * properties will be grouped together in the initial setState object, but will have independent
 * watchers set for each properties. Likewise, you can specify the properties in any of the formats
 * described above.
 * Eg.
 * store.setAndWatch(['basket', 'user.firstName', {'loves.currentLoves': 'loves'}], this, callback);
 *
 * @param  {object} component - Component reference if state is to be controlled automatically
 * Eg. store.setAndWatch('user', this, null, true); You can pass { ignoreAutoUnsubscribe: true }
 * if you don't need the state operations and auto unsubscriptions but still get and watch
 * a given value with the callback (useful for just doing side effects or usage in util functions).
 *
 * @param  {function} callback - Callback function gets executed initially after setState and in
 * each watcher's tick. If no component was passed the callback is still executed initially and in
 * each watcher's tick. The callback gets passed the given store property value, and its old value
 * in the case of the watcher.
 * Eg. store.setAndWatch('user.firstName', null, (name) => console.log('Hi, ' + name));
 *
 * @param {number} stateStrategy - determines the way that state should be updated.
 * Can take one of store.STATE_STRATEGIES values, see descriptions for each strategy there.
 * For non-zero values of stateStrategy valid component param MUST be passed.
 * Boolean value will be converted to STATE_STRATEGIES.NONE and STATE_STRATEGIES.ALWAYS respectively
 * for backward compatibility reason. Default value is STATE_STRATEGIES.NONE
 *
 * If you need more leverage in your state operation, you can use the callback for setting state.
 * Just make sure you don't pass the component reference.
 * Eg. store.setAndWatch('user', null, (userData) => {
 *      this.setState({
 *          user: userData,
 *          isBI: this.isBeautyInsider(userData);
 *      });
 * });
 *
 * @return {array} - returns an array with all the store watchers that were set.
 * Please note that store.setAndWatch will help you automatically unsubscribe your watcher on
 * componentWillUnmount hook. But you always can handle the unsubscription by yourself if needed,
 * for example if you want to unsubscribe immediately.
 *
 * store.subscribe returns a function which you call in order to remove the subscription,
 * so in this case you can unsubscribe from a given property like this:
 *
 * let subscriptions = store.setAndWatch(['user'], this);
 * subscriptions[0]();
 */

/*jshint ignore:start*/
/* eslint-disable-next-line complexity */
store.setAndWatch = function (properties, component, callback = null, stateStrategy = STATE_STRATEGIES.NONE) {
    if (typeof properties === 'string' || isObject(properties)) {
        // eslint-disable-next-line no-param-reassign
        properties = [properties];
    }

    // convert the legacy boolean shouldSetState paramenter to the corresponding STATE_STRATEGIES value
    // for backward compatibility
    if (typeof stateStrategy !== 'number') {
        // eslint-disable-next-line no-param-reassign
        stateStrategy = stateStrategy ? STATE_STRATEGIES.ALWAYS : STATE_STRATEGIES.NONE;
    }

    if (stateStrategy === STATE_STRATEGIES.ALWAYS && (!component || !component.state)) {
        console.error('[Store.setAndWatch]: Components passed must have a state object in order ' + 'to set state. Skipping state operation.');
    }

    if (isWarningAllowed && Sephora.isSpa && [STATE_STRATEGIES.CLIENT_SIDE_DATA, STATE_STRATEGIES.DIRECT_INIT].indexOf(stateStrategy) === -1) {
        console.warn(
            '[Store.setAndWatch]: Using default setState strategies for SPA pages is depricated. ' +
                'Please use CLIENT_SIDE_DATA or DIRECT_INIT instead'
        );
    }

    function handleState(value, oldValue = null, setStateDirectly = false) {
        if (component && stateStrategy !== STATE_STRATEGIES.NONE) {
            if (setStateDirectly) {
                const currentState = component.state || {};
                component.state = {
                    ...currentState,
                    ...value
                };
                callback && callback.call(component, value, oldValue);
            } else if (component.state) {
                component.setState({ ...value }, () => {
                    if (callback) {
                        callback.call(component, value, oldValue);
                    }
                });
            }
        } else if (callback) {
            callback(value, oldValue);
        }
    }

    function getPropertyName(property) {
        // Names property after the deepest nested property
        if (property.indexOf('.') > -1) {
            return property.split('.').pop();
        } else {
            return property;
        }
    }

    function getObjectData(object) {
        const objectProperties = Object.keys(object);

        if (objectProperties.length > 1) {
            console.error(
                '[Store.setAndWatch]: Objects passed can only have one assigned proper' +
                    'ty each. Use separate objects for each property that you need to set and watch.'
            );
        }

        const keyName = objectProperties[0];
        const keyValue = object[keyName];

        return {
            keyName,
            keyValue
        };
    }

    function getProperyMap() {
        const propertyMap = {};
        properties.forEach(property => {
            let storeValue;
            let propertyName;

            if (isObject(property)) {
                const { keyName, keyValue } = getObjectData(property);

                storeValue = getValue(store.getState(), keyName);
                propertyName = keyValue;
            } else {
                storeValue = getValue(store.getState(), property);
                propertyName = getPropertyName(property);
            }

            propertyMap[propertyName] = storeValue;
        });

        return propertyMap;
    }

    // do not set initial state for client data if hydration is not finished or isNodeRender
    if (stateStrategy === STATE_STRATEGIES.CLIENT_SIDE_DATA && !Sephora.Util.InflatorComps.services?.loadEvents?.HydrationFinished) {
        Sephora.isNodeRender ||
            handleStateQueue.push(() => {
                handleState(getProperyMap(), null);
            });
    } else {
        handleState(getProperyMap(), null, stateStrategy === STATE_STRATEGIES.DIRECT_INIT || stateStrategy === STATE_STRATEGIES.CLIENT_SIDE_DATA);
    }

    const unsubscribers = [];

    // Do not subscribe watchers to the store when rendered server side
    if (Sephora.isNodeRender) {
        properties.forEach(() => {
            unsubscribers.push(dummyUnsubscriber);
        });

        return unsubscribers;
    }

    initializeFrameworkFields(component);
    const listeners = [];
    properties.forEach(property => {
        let watcher;
        let propertyName;

        if (isObject(property)) {
            const { keyName, keyValue } = getObjectData(property);

            watcher = watch(store.getState, keyName);
            propertyName = keyValue;
        } else {
            watcher = watch(store.getState, property);
            propertyName = getPropertyName(property);
        }

        const listener = watcher((newValue, oldValue) => {
            if (!component || component['__ufe__'].listeners[listener]?.enable) {
                handleState({ [propertyName]: newValue }, { [propertyName]: oldValue });
            }
        });
        listeners.push(listener);
    });

    function isAsyncRender(comp) {
        const proto = Object.getPrototypeOf(comp);

        return proto && proto.asyncRender;
    }

    /*
        If state is expected to contain client side data (stateStrategy === STATE_STRATEGIES.CLIENT_SIDE_DATA)
        wait for hydration to be finished so that server-side and client-side components match.
        Exceptons:
            - Sephora.isNodeRender. Server side do not include hydration process
            - hydration is already finished
            - if component is marked as async rendered
    */
    const shouldSubscribeAsync =
        stateStrategy === STATE_STRATEGIES.CLIENT_SIDE_DATA &&
        !Sephora.isNodeRender &&
        !Sephora.Util.InflatorComps.services?.loadEvents?.HydrationFinished &&
        component &&
        !isAsyncRender(component);

    if (shouldSubscribeAsync) {
        // lazy (async) execution on hydration stage
        for (const watcher of listeners) {
            const queueItem = {
                watcher,
                component,
                invoked: false,
                unsubscribeOrig: null,
                // unsubscribe can be called
                // (a) before hydration is finished -> we should not subscribe the watcher to the store and attach unsubscribe to the component
                // (b) after hydration is finished -> we should call unsubscribeOrig
                unsubscribe: function (...args) {
                    this.invoked = true;
                    this.unsubscribeOrig && this.unsubscribeOrig(args);
                }
            };
            watchersQueue.push(queueItem);
            unsubscribers.push(queueItem.unsubscribe.bind(queueItem));
        }
    } else {
        for (const listener of listeners) {
            unsubscribers.push(store.subscribe(listener, component, true));
        }
    }

    return unsubscribers;
};

/**
 * Subscribes to action directly without use of any reducers
 * @param  {string} action - the action type to listen to
 * @param  {function} handler - function which will be invoke on action dispatch
 * @return {function} - returns a function which should be invoked to unsubscribe from the action
 */
store.watchAction = function (action, handler) {
    suppresDispatchWarning = true;
    const result = reduxActionWatch.actionCreators.onAction(store.dispatch)(action, handler);
    suppresDispatchWarning = false;

    return result;
};

/*jshint ignore:end*/

export default store;
