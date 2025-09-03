const { any, createSpy } = jasmine;
const { shallow } = require('enzyme');
const React = require('react');

describe('Store', () => {
    let store;
    let component;

    describe('subscribe', () => {
        const LovesCount = require('components/ProductPage/LovesCount/LovesCount').default;

        beforeEach(() => {
            store = require('store/Store').default;
            const wrapper = shallow(<LovesCount />);
            component = wrapper.instance();
        });

        it('should not create unsubscribe function for listener when component argument is not provided', () => {
            // Arrange
            spyOn(Sephora, 'isNodeRender').and.returnValue(true);
            const listener = createSpy('listener');

            // Act
            store.subscribe(listener);

            // Assert
            const { unsubscribers } = component['__ufe__'];
            expect(unsubscribers.length).toEqual(0);
        });

        it('should create configuration for each listener', () => {
            // Arrange
            spyOn(Sephora, 'isNodeRender').and.returnValue(true);
            const listener = createSpy('listener');
            const listenerConfig = { enable: true };

            // Act
            store.subscribe(listener, component);

            // Assert
            const { listeners } = component['__ufe__'];
            expect(listeners[listener]).toEqual(listenerConfig);
        });

        it('should create unsubscribe function for each listener', () => {
            // Arrange
            spyOn(Sephora, 'isNodeRender').and.returnValue(true);
            const listener = createSpy('listener');

            // Act
            store.subscribe(listener, component);

            // Assert
            const { unsubscribers } = component['__ufe__'];
            expect(unsubscribers.length).toEqual(1);
        });

        it('should update configuration when unsubscribe function is invoked', () => {
            // Arrange
            spyOn(Sephora, 'isNodeRender').and.returnValue(true);
            const listener = createSpy('listener');
            const listenerConfig = { enable: false };

            // Act
            store.subscribe(listener, component);
            const { unsubscribers } = component['__ufe__'];
            const unsubscribe = unsubscribers[0];
            unsubscribe();

            // Assert
            const { listeners } = component['__ufe__'];
            expect(listeners[listener]).toEqual(listenerConfig);
        });
    });

    describe('setAndWatch CLIENT_SIDE_DATA strategy', () => {
        const { UPDATE } = require('constants/actionTypes/user');
        let setStateSpy;

        const preHydrationSetup = comp => {
            Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished = false;
            store = require('store/Store').default;

            store.setAndWatch('user.dummyData', comp, null, store.STATE_STRATEGIES.CLIENT_SIDE_DATA);
        };

        const postHydrationSetup = comp => {
            Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished = true;
            store = require('store/Store').default;

            // add some dummy data to the store
            store.dispatch({
                type: UPDATE,
                data: { dummyData: 'one' }
            });

            store.setAndWatch('user.dummyData', comp, null, store.STATE_STRATEGIES.CLIENT_SIDE_DATA);
        };

        beforeEach(() => {
            component = {
                state: {},
                setState: function (obj, callback) {
                    Object.assign(this.state, obj);

                    if (callback) {
                        callback();
                    }
                },
                callback: function () {
                    return;
                }
            };
            setStateSpy = spyOn(component, 'setState').and.callThrough();
        });

        describe('pre hydration scenario', () => {
            beforeEach(() => {
                Sephora.Util = Sephora.Util || {};
                Sephora.Util.getCurrentUser = () => ({ isRecognized: true });
            });

            it('should not set state', () => {
                preHydrationSetup(component);
                expect(component.state).toEqual({});
            });

            it('should not call setState', () => {
                preHydrationSetup(component);
                expect(setStateSpy).not.toHaveBeenCalled();
            });

            it('should not react on store changes', () => {
                preHydrationSetup(component);
                store.dispatch({
                    type: UPDATE,
                    data: { dummyData: 'one' }
                });
                expect(setStateSpy).not.toHaveBeenCalled();
            });

            it('should call setState once hydration is finished', () => {
                preHydrationSetup(component);
                store.dispatch({
                    type: UPDATE,
                    data: { dummyData: 'one' }
                });
                store.onHydrationFinished();
                expect(setStateSpy).toHaveBeenCalledWith({ dummyData: 'one' }, any(Function));
            });

            it('should react on store changes once hydration is finished', () => {
                preHydrationSetup(component);
                store.dispatch({
                    type: UPDATE,
                    data: { dummyData: 'one' }
                });

                store.onHydrationFinished();
                store.dispatch({
                    type: UPDATE,
                    data: { dummyData: 'two' }
                });

                expect(setStateSpy).toHaveBeenCalledTimes(2);
                expect(setStateSpy).toHaveBeenCalledWith({ dummyData: 'two' }, any(Function));
            });
        });

        describe('post hydration scenario', () => {
            it('should not call setState', () => {
                postHydrationSetup(component);
                expect(setStateSpy).not.toHaveBeenCalled();
            });

            it('should set state directly', () => {
                postHydrationSetup(component);
                expect(component.state).toEqual({ dummyData: 'one' });
            });

            it('should call setState on store change', () => {
                postHydrationSetup(component);
                store.dispatch({
                    type: UPDATE,
                    data: { dummyData: 'two' }
                });
                expect(setStateSpy).toHaveBeenCalledTimes(1);
            });

            it('should call setState with correct args on store change', () => {
                postHydrationSetup(component);
                store.dispatch({
                    type: UPDATE,
                    data: { dummyData: 'two' }
                });
                expect(setStateSpy).toHaveBeenCalledWith({ dummyData: 'two' }, any(Function));
            });
        });
    });

    describe('setAndWatch method', () => {
        let consoleStub;

        beforeEach(() => {
            // eslint-disable-next-line no-console
            consoleStub = console.error;
            store = require('store/Store').default;
            component = {
                state: { user: {}, auth: {} },
                setState: function (obj, callback) {
                    Object.assign(this.state, obj);

                    if (callback) {
                        callback();
                    }
                },
                callback: function () {
                    return;
                }
            };
            Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished = true;
        });

        describe('parameters', () => {
            let mockObject;

            beforeEach(() => {
                mockObject = {
                    basket: 'myBasket',
                    user: 'myUser'
                };
            });
            it('should log an error if an object with multiple properties is passed', () => {
                store.setAndWatch(mockObject, null);
                expect(consoleStub).toHaveBeenCalled();
            });

            it('should log an error if an object with multiple properties is passed inside' + ' array', () => {
                store.setAndWatch([mockObject], null);
                expect(consoleStub).toHaveBeenCalled();
            });

            it('should not set state if a component parameter was passed without a state ' + 'object', () => {
                const setStateSpy = spyOn(component, 'setState');
                delete component.state;
                store.setAndWatch('user', component, null, true);
                expect(setStateSpy).not.toHaveBeenCalled();
            });
        });

        describe('store interactions', () => {
            it('should call store.getState twice with a single passed property', () => {
                // Gets called twice for inital state setting and when the watcher is set
                const getStateSpy = spyOn(store, 'getState');
                store.setAndWatch('user', null);
                expect(getStateSpy).toHaveBeenCalledTimes(2);
            });

            it('should call store.getState four times with two passed properties', () => {
                const getStateSpy = spyOn(store, 'getState');
                store.setAndWatch(['user', 'basket'], null);
                expect(getStateSpy.calls.count()).toBe(4);
            });

            it('should call store.subscribe once with a single passed property', () => {
                const subscribeSpy = spyOn(store, 'subscribe');
                store.setAndWatch('user', null);
                expect(subscribeSpy).toHaveBeenCalledTimes(1);
            });

            it('should call store.subscribe twice with two passed properties', () => {
                const subscribeSpy = spyOn(store, 'subscribe');
                store.setAndWatch(['user', 'basket'], null);
                expect(subscribeSpy).toHaveBeenCalledTimes(2);
            });
        });

        describe('callbacks', () => {
            describe('should execute callback initially', () => {
                it('if passed without component', () => {
                    const callbackSpy = spyOn(component, 'callback');
                    store.setAndWatch('user', component, component.callback);
                    expect(callbackSpy).toHaveBeenCalledTimes(1);
                });

                it('if passed with component and ALWAYS strategy (legacy)', () => {
                    const callbackSpy = spyOn(component, 'callback');
                    store.setAndWatch('user', component, component.callback, true);
                    expect(callbackSpy).toHaveBeenCalledTimes(1);
                });

                it('if passed with component and ALWAYS strategy', () => {
                    const callbackSpy = spyOn(component, 'callback');
                    store.setAndWatch('user', component, component.callback, store.STATE_STRATEGIES.ALWAYS);
                    expect(callbackSpy).toHaveBeenCalledTimes(1);
                });

                it('if passed with component and NONE strategy (legacy)', () => {
                    const callbackSpy = spyOn(component, 'callback');
                    store.setAndWatch('user', component, component.callback, false);
                    expect(callbackSpy).toHaveBeenCalledTimes(1);
                });

                it('if passed with component and NONE strategy', () => {
                    const callbackSpy = spyOn(component, 'callback');
                    store.setAndWatch('user', component, component.callback, store.STATE_STRATEGIES.NONE);
                    expect(callbackSpy).toHaveBeenCalledTimes(1);
                });

                it('if passed with component and DIRECT_INIT strategy', () => {
                    const callbackSpy = spyOn(component, 'callback');
                    store.setAndWatch('user', component, component.callback, store.STATE_STRATEGIES.DIRECT_INIT);
                    expect(callbackSpy).toHaveBeenCalledTimes(1);
                });
            });

            it('should execute callback initially and when watcher is triggered', () => {
                const callbackSpy = spyOn(component, 'callback');
                const update = require('actions/UserActions').default.update;
                store.setAndWatch('user', component, component.callback);

                store.dispatch(update({ profileStatus: 4 }));
                expect(callbackSpy).toHaveBeenCalledTimes(2);
            });

            it('should pass new store value to callback when watcher is triggered', () => {
                const callbackSpy = spyOn(component, 'callback');
                const update = require('actions/UserActions').default.update;
                store.setAndWatch('user', component, component.callback);

                store.dispatch(update({ profileStatus: 4 }));
                expect(callbackSpy.calls.argsFor(1)[0].user.profileStatus).toBe(4);
            });

            it('should pass old store value to callback when watcher is triggered', () => {
                const callbackSpy = spyOn(component, 'callback');
                const update = require('actions/AuthActions').default.updateProfileStatus;
                store.setAndWatch('auth', component, component.callback);

                store.dispatch(update(4));
                expect(callbackSpy.calls.argsFor(1)[1].auth.profileStatus).toBe(0);
            });
        });

        describe('state interactions', () => {
            describe('with NONE state strategy', () => {
                it('should not call setState initially', () => {
                    const setStateSpy = spyOn(component, 'setState');
                    store.setAndWatch('user', component, null, store.STATE_STRATEGIES.NONE);
                    expect(setStateSpy).not.toHaveBeenCalled();
                });

                it('should not call setState initially (boolean)', () => {
                    const setStateSpy = spyOn(component, 'setState');
                    store.setAndWatch('user', component, null, false);
                    expect(setStateSpy).not.toHaveBeenCalled();
                });

                it('should not update state directly', () => {
                    const update = require('actions/AuthActions').default.updateProfileStatus;
                    store.dispatch(update(777));
                    store.setAndWatch('auth', component, null, store.STATE_STRATEGIES.NONE);
                    expect(component.state.auth.profileStatus).not.toEqual(777);
                });

                it('should not update state directly (boolean)', () => {
                    const update = require('actions/AuthActions').default.updateProfileStatus;
                    store.dispatch(update(888));
                    store.setAndWatch('auth', component, null, false);
                    expect(component.state.auth.profileStatus).not.toEqual(888);
                });
            });

            describe('with ALWAYS state strategy', () => {
                it('should call setState initially', () => {
                    const setStateSpy = spyOn(component, 'setState');
                    store.setAndWatch('user', component, null, store.STATE_STRATEGIES.ALWAYS);
                    expect(setStateSpy).toHaveBeenCalledTimes(1);
                });

                it('should call setState initially (boolean)', () => {
                    const setStateSpy = spyOn(component, 'setState');
                    store.setAndWatch('user', component, null, true);
                    expect(setStateSpy).toHaveBeenCalledTimes(1);
                });
            });

            describe('with DIRECT_INIT state strategy', () => {
                beforeEach(() => {
                    const update = require('actions/AuthActions').default.updateProfileStatus;
                    store.dispatch(update(4));
                });

                it('should not call setState', () => {
                    const setStateSpy = spyOn(component, 'setState');
                    store.setAndWatch('user', component, null, store.STATE_STRATEGIES.DIRECT_INIT);
                    expect(setStateSpy).not.toHaveBeenCalled();
                });

                it('should directly update state', () => {
                    store.setAndWatch('auth', component, null, store.STATE_STRATEGIES.DIRECT_INIT);
                    expect(component.state.auth.profileStatus).toEqual(4);
                });
            });

            it('should setState to the property passed as string', () => {
                store.setAndWatch('user', component, null, true);
                expect(Object.prototype.hasOwnProperty.call(component.state, 'user')).toBe(true);
            });

            it('should setState to the explicit property name passed as object value', () => {
                store.setAndWatch({ user: 'myUser' }, component, null, true);
                expect(Object.prototype.hasOwnProperty.call(component.state, 'myUser')).toBe(true);
            });

            it('should setState to the deepest nested property passed as string', () => {
                store.setAndWatch('user.beautyInsiderAccount.firstName', component, null, true);
                expect(Object.prototype.hasOwnProperty.call(component.state, 'firstName')).toBe(true);
            });

            it('should setState to the single property passed as string inside an array', () => {
                store.setAndWatch(['user'], component, null, true);
                expect(Object.prototype.hasOwnProperty.call(component.state, 'user')).toBe(true);
            });

            it('should setState to the single explict property passed as object inside an ' + 'array', () => {
                store.setAndWatch([{ user: 'myUser' }], component, null, true);
                expect(Object.prototype.hasOwnProperty.call(component.state, 'user')).toBe(true);
            });

            it('should setState to the deepest nested single property passed as string inside ' + 'an array', () => {
                store.setAndWatch(['user.beautyInsiderAccount.firstName'], component, null, true);
                expect(Object.prototype.hasOwnProperty.call(component.state, 'user')).toBe(true);
            });

            it('should setState to multiple properties passed as strings', () => {
                store.setAndWatch(['user', 'basket'], component, null, true);
                expect(Object.prototype.hasOwnProperty.call(component.state, 'user')).toBe(true);
                expect(Object.prototype.hasOwnProperty.call(component.state, 'basket')).toBe(true);
            });

            it('should setState to multiple explicit properties passed as objects', () => {
                store.setAndWatch([{ user: 'myUser' }, { basket: 'myBasket' }], component, null, true);

                expect(Object.prototype.hasOwnProperty.call(component.state, 'myUser')).toBe(true);
                expect(Object.prototype.hasOwnProperty.call(component.state, 'myBasket')).toBe(true);
            });

            it('should setState to the deepest nested multiple properties passed as ' + 'strings', () => {
                store.setAndWatch(['user.firstName', 'basket.items'], component, null, true);
                expect(Object.prototype.hasOwnProperty.call(component.state, 'firstName')).toBe(true);
                expect(Object.prototype.hasOwnProperty.call(component.state, 'items')).toBe(true);
            });

            it('should setState to the multiple properties passed in different formats', () => {
                store.setAndWatch(['user', { basket: 'myBasket' }, 'loves.currentLoves'], component, null, true);
                expect(Object.prototype.hasOwnProperty.call(component.state, 'user')).toBe(true);
                expect(Object.prototype.hasOwnProperty.call(component.state, 'myBasket')).toBe(true);
                expect(Object.prototype.hasOwnProperty.call(component.state, 'currentLoves')).toBe(true);
            });

            it('should setState to N multiple properties passed', () => {
                const properties = ['a', 'b', 'c', 'd', 'e'];
                const stateProperties = [];

                store.setAndWatch(properties, component, null, true);

                for (const prop of properties) {
                    if (Object.prototype.hasOwnProperty.call(component.state, prop)) {
                        stateProperties.push(prop);
                    }
                }

                expect(stateProperties.length).toEqual(properties.length);
            });

            it('should call setState with store value', () => {
                const mockObject = { user: 'John Appleseed' };
                spyOn(store, 'getState').and.callFake(function () {
                    return mockObject;
                });
                const setStateSpy = spyOn(component, 'setState');

                store.setAndWatch('user', component, null, true);

                expect(setStateSpy.calls.argsFor(0)[0]).toEqual(mockObject);
            });

            it('should call setState with multiple store values', () => {
                const mockObject = {
                    user: { firstName: 'John Appleseed' },
                    basket: { count: 2 }
                };

                spyOn(store, 'getState').and.callFake(function () {
                    return mockObject;
                });

                const setStateSpy = spyOn(component, 'setState');

                store.setAndWatch(['user.firstName', 'basket.count'], component, null, true);

                expect(setStateSpy.calls.argsFor(0)[0]).toEqual({
                    firstName: mockObject.user.firstName,
                    count: mockObject.basket.count
                });
            });
        });

        describe('return statement', () => {
            it('should return an array', () => {
                const props = ['user', 'basket'];
                const callbacks = store.setAndWatch(props, component, null, true);
                expect(Array.isArray(callbacks)).toBe(true);
            });

            it('should return a watcher for each property passed', () => {
                const props = ['user', 'basket'];
                const callbacks = store.setAndWatch(props, component, null, true);
                expect(callbacks.length).toEqual(props.length);
            });

            it('should return an array of functions', () => {
                const props = ['user', 'basket'];
                const callbacks = store.setAndWatch(props, component, null, true);
                callbacks.forEach(callback => expect(typeof callback).toEqual('function'));
            });
        });
    });

    // describe('watchAction method', () => {
    //     let reduxActionWatch;
    //     let actionStub;
    //     let handlerStub;
    //     let onActionSpy;
    //     let unsubscribe;

    //     beforeEach(done => {
    //         store = require('store/Store').default;
    //         reduxActionWatch = require('redux-action-watch');
    //         onActionSpy = spyOn(reduxActionWatch.actionCreators, 'onAction').and.callThrough();
    //         actionStub = {
    //             type: 'action type',
    //             payload: 'payload'
    //         };
    //         handlerStub = createSpy().and.callFake(done);
    //         unsubscribe = store.watchAction(actionStub.type, handlerStub);
    //         store.dispatch(actionStub);
    //     });

    //     it('should register a watcher for an action', () => {
    //         expect(onActionSpy).toHaveBeenCalled();
    //     });

    //     it('should invoke the listener on action dispatch', () => {
    //         expect(handlerStub).toHaveBeenCalledTimes(1);
    //     });

    //     it('should return a function to unsusbcribe the listener', () => {
    //         expect(typeof unsubscribe).toEqual('function');
    //     });
    // });
});
