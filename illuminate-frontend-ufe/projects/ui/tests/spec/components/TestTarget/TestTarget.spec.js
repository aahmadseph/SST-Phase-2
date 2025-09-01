const React = require('react');
const { any, createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('TestTarget component', () => {
    const TestTargetActions = require('actions/TestTargetActions').default;
    let TestTarget;
    let store;
    let mockProps;

    beforeEach(() => {
        store = require('store/Store').default;
        TestTarget = require('components/TestTarget/TestTarget').default;
        Sephora.Util.InflatorComps.Comps = {
            InlineBasket: { getReactClass: createSpy() },
            BccImage: { getReactClass: createSpy() },
            PersistentBanner: { getReactClass: createSpy() }
        };
        mockProps = {
            testName: 'inlineBasket',
            testEnabled: true,
            testComponent: 'InlineBasket'
        };
    });

    afterEach(() => {
        Sephora.Util.InflatorComps.Comps = {};
        Sephora.configurationSettings.ABTests = {};
    });

    describe('ctrlr method', () => {
        let component;
        let executeTestStub;
        let subscribeStub;
        let fakePromise;

        it('should call loadClass method once initially to get the component class reference', done => {
            const wrapper = shallow(<TestTarget {...mockProps} />);
            component = wrapper.instance();
            const loadClassStub = spyOn(component, 'loadClass').and.returnValue({ then: function () {} });
            component.componentDidMount();
            expect(loadClassStub).toHaveBeenCalledTimes(1);
            done();
        });

        describe('after test component class has been loaded', () => {
            it('should call executeTest method once initially', done => {
                const wrapper = shallow(<TestTarget {...mockProps} />);
                component = wrapper.instance();

                executeTestStub = spyOn(component, 'executeTest');

                fakePromise = {
                    then: function (resolve) {
                        resolve();
                        expect(executeTestStub).toHaveBeenCalledTimes(1);
                    }
                };

                spyOn(component, 'loadClass').and.returnValue(fakePromise);
                component.componentDidMount();
                done();
            });

            it('should subscribe to the testTarget.readyState', done => {
                const wrapper = shallow(<TestTarget {...mockProps} />);
                component = wrapper.instance();

                fakePromise = {
                    then: function (resolve) {
                        subscribeStub = spyOn(store, 'subscribe');
                        resolve();
                        expect(subscribeStub).toHaveBeenCalledWith(any(Function), component);
                    }
                };

                spyOn(component, 'loadClass').and.returnValue(fakePromise);
                component.componentDidMount();
                done();
            });

            it('should not subscribe to the testTarget.readyState if test is BCC test', done => {
                Sephora.configurationSettings.ABTests = { inlineBasket: true };
                const wrapper = shallow(<TestTarget {...mockProps} />);
                component = wrapper.instance();

                fakePromise = {
                    then: function (resolve) {
                        subscribeStub = spyOn(store, 'subscribe');
                        resolve();
                        expect(subscribeStub).not.toHaveBeenCalled();
                    }
                };

                spyOn(component, 'loadClass').and.returnValue(fakePromise);
                component.componentDidMount();
                done();
            });
        });

        describe('store subscription callback', () => {
            let setStateStub;

            beforeEach(() => {
                const wrapper = shallow(<TestTarget {...mockProps} />);
                component = wrapper.instance();
                executeTestStub = spyOn(component, 'executeTest');
                setStateStub = spyOn(component, 'setState');
            });

            describe('when setting adobe offers', () => {
                it('should executeTest', done => {
                    fakePromise = {
                        then: function (resolve) {
                            resolve();
                            store.dispatch(TestTargetActions.setOffers({ inlineBasket: true }));
                            // Expected twice because it is called initially once by default
                            expect(executeTestStub).toHaveBeenCalledTimes(2);
                        }
                    };
                    spyOn(component, 'loadClass').and.returnValue(fakePromise);
                    component.componentDidMount();
                    done();
                });

                it('should not hide the component', done => {
                    fakePromise = {
                        then: function (resolve) {
                            resolve();
                            store.dispatch(TestTargetActions.setOffers({ inlineBasket: true }));
                            expect(setStateStub).not.toHaveBeenCalled();
                        }
                    };
                    spyOn(component, 'loadClass').and.returnValue(fakePromise);
                    component.componentDidMount();
                    done();
                });
            });

            describe('on forceReset()', () => {
                it('should not executeTest', done => {
                    fakePromise = {
                        then: function (resolve) {
                            resolve();
                            store.dispatch(TestTargetActions.forceReset({}));
                            // Expected once because it is called initially once by default
                            expect(executeTestStub).toHaveBeenCalledTimes(1);
                        }
                    };
                    spyOn(component, 'loadClass').and.returnValue(fakePromise);
                    component.componentDidMount();
                    done();
                });

                it('should hide the component', done => {
                    fakePromise = {
                        then: function (resolve) {
                            resolve();
                            store.dispatch(TestTargetActions.forceReset({}));
                            expect(setStateStub).toHaveBeenCalledWith({
                                displayComponent: null,
                                showSkeleton: false
                            });
                        }
                    };
                    spyOn(component, 'loadClass').and.returnValue(fakePromise);
                    component.componentDidMount();
                    done();
                });
            });
        });
    });

    describe('executeTest method', () => {
        let component;
        let defaultToControlSpy;

        describe('injectProps tests', () => {
            const mockResults = {
                currentTest: {
                    testType: 'injectProps',
                    props: {}
                },
                testName: 'persistentBanner1'
            };
            let getNewPropsStub;
            let wrapper;

            beforeEach(() => {
                spyOn(store, 'getState').and.returnValue({ testTarget: { timeout: false } });

                const props = {
                    testName: 'persistentBanner1',
                    testComponent: 'PersistentBanner',
                    testEnabled: true
                };
                wrapper = shallow(<TestTarget {...props} />);
                component = wrapper.instance();
            });

            it('should call getNewProps method to prepare incoming props', () => {
                spyOn(component, 'getTestResults').and.returnValue(mockResults);
                getNewPropsStub = spyOn(component, 'getNewProps');
                component.executeTest();
                expect(getNewPropsStub).toHaveBeenCalledWith(component.props, mockResults.currentTest.props, mockResults.testName);
            });

            it('should call defaultToControl method if getNewProps returns null', () => {
                spyOn(component, 'getTestResults').and.returnValue(mockResults);
                getNewPropsStub = spyOn(component, 'getNewProps').and.returnValue(null);
                defaultToControlSpy = spyOn(component, 'defaultToControl');
                component.executeTest();
                expect(defaultToControlSpy).toHaveBeenCalled();
            });

            it('should call defaultToControl method if test result has no prop object', () => {
                spyOn(component, 'getTestResults').and.returnValue({ currentTest: { testType: 'injectProps' } });
                defaultToControlSpy = spyOn(component, 'defaultToControl');
                component.executeTest();
                expect(defaultToControlSpy).toHaveBeenCalled();
            });

            it('should call setState if getNewProps returns an object', () => {
                spyOn(component, 'getTestResults').and.returnValue(mockResults);
                const setStateStub = spyOn(component, 'setState');
                getNewPropsStub = spyOn(component, 'getNewProps').and.returnValue({});
                component.executeTest();
                expect(setStateStub).toHaveBeenCalled();
            });

            it('should pass merged props to setState if getNewProps returns true', () => {
                spyOn(component, 'getTestResults').and.returnValue(mockResults);
                wrapper.setProps({ testProp: false });
                mockResults.currentTest.props.testProp = true;
                const setStateStub = spyOn(component, 'setState');
                getNewPropsStub = spyOn(component, 'getNewProps').and.returnValue({
                    ...component.props,
                    ...mockResults.currentTest.props
                });
                component.executeTest();
                expect(setStateStub.calls.argsFor(0)[0].updateProps.testProp).toEqual(true);
            });
        });

        it('should call defaultToControl method if store.testTarget.timeout is true', () => {
            const cancelOffers = TestTargetActions.cancelOffers;
            const props = {
                testName: 'inlineBasket',
                testComponent: 'InlineBasket',
                testEnabled: true
            };
            const wrapper = shallow(<TestTarget {...props} />);
            component = wrapper.instance();
            defaultToControlSpy = spyOn(component, 'defaultToControl');

            store.dispatch(cancelOffers(true));
            component.executeTest();
            expect(defaultToControlSpy).toHaveBeenCalled();
        });

        it('should call defaultToControl method if props.testEnabled is false', () => {
            const props = {
                testName: 'inlineBasket',
                testComponent: 'InlineBasket',
                testEnabled: false
            };
            const wrapper = shallow(<TestTarget {...props} />);
            component = wrapper.instance();
            defaultToControlSpy = spyOn(component, 'defaultToControl');
            component.executeTest();
            expect(defaultToControlSpy).toHaveBeenCalled();
        });

        it('should call defaultToControl method if no props.testName is passed', () => {
            const props = {
                testComponent: 'InlineBasket',
                testEnabled: true
            };
            const wrapper = shallow(<TestTarget {...props} />);
            component = wrapper.instance();
            defaultToControlSpy = spyOn(component, 'defaultToControl');
            component.executeTest();
            expect(defaultToControlSpy).toHaveBeenCalled();
        });

        it('should call defaultToControl if testName doesnt exist in store.testTarget', () => {
            const setOffers = TestTargetActions.setOffers;
            const props = {
                testName: 'catNav',
                testComponent: 'InlineBasket',
                testEnabled: true
            };
            const wrapper = shallow(<TestTarget {...props} />);
            component = wrapper.instance();
            defaultToControlSpy = spyOn(component, 'defaultToControl');
            store.dispatch(setOffers({ inlineBasket: true }));
            component.executeTest();
            expect(defaultToControlSpy).toHaveBeenCalled();
        });

        it('should update state with testComponent and store.testTarget results', () => {
            const setOffers = TestTargetActions.setOffers;
            const props = {
                testName: 'inlineBasket',
                testComponent: undefined,
                testEnabled: true
            };
            const wrapper = shallow(<TestTarget {...props} />);
            component = wrapper.instance();
            const setStateSpy = spyOn(component, 'setState');
            store.dispatch(setOffers({ inlineBasket: true }));
            component.executeTest();

            expect(setStateSpy).toHaveBeenCalledWith({
                displayComponent: Sephora.Util.InflatorComps.Comps.InlineBasket.getReactClass(),
                updateProps: { testTarget: { inlineBasket: true } },
                showSkeleton: false
            });
        });

        it('should execute callback if passed as prop', () => {
            const setOffers = TestTargetActions.setOffers;
            const props = {
                testName: 'inlineBasket',
                testComponent: 'InlineBasket',
                testEnabled: true,
                testCallback: createSpy()
            };
            const wrapper = shallow(<TestTarget {...props} />);
            component = wrapper.instance();
            spyOn(component, 'setState');
            store.dispatch(setOffers({ inlineBasket: true }));
            component.executeTest();

            expect(component.props.testCallback).toHaveBeenCalled();
        });
    });

    describe('defaultToControl method', () => {
        it('should update state with testComponent and updateProps.testTarget false', () => {
            const props = {
                testName: 'inlineBasket',
                testComponent: undefined,
                testEnabled: true
            };
            const wrapper = shallow(<TestTarget {...props} />);
            const component = wrapper.instance();
            const setStateSpy = spyOn(component, 'setState');
            component.defaultToControl();

            expect(setStateSpy).toHaveBeenCalledWith({
                displayComponent: Sephora.Util.InflatorComps.Comps.InlineBasket.getReactClass(),
                updateProps: { testTarget: false },
                showSkeleton: false
            });
        });
    });

    describe('shouldHideComponent method', () => {
        let component;

        beforeEach(() => {
            const props = {
                testName: 'inlineBasket',
                testComponent: 'InlineBasket',
                testEnabled: true
            };
            const wrapper = shallow(<TestTarget {...props} />);
            component = wrapper.instance();
        });

        // Define an array of test cases
        const testCases = [
            { testResult: { isHidden: true }, expected: true },
            { testResult: { isHidden: false }, expected: false },
            { testResult: {}, expected: false }
        ];

        // Iterate over each test case and create a separate test
        testCases.forEach(({ testResult, expected }) => {
            it('should determine if the component should be hidden correctly', () => {
                const hideComp = component.shouldHideComponent(testResult);
                expect(hideComp).toBe(expected);
            });
        });
    });

    describe('getNewProps method', () => {
        let newProps;
        let component;
        const oldProps = {
            a: true,
            b: 1,
            c: {
                d: 'a',
                e: 'ab',
                f: { g: true }
            }
        };

        beforeEach(() => {
            const wrapper = shallow(<TestTarget />);
            component = wrapper.instance();
        });

        it('should return new prop object if schema matches original props', () => {
            newProps = {
                a: false,
                b: 2,
                c: {
                    d: 'a',
                    e: 'ab',
                    f: { g: false }
                }
            };

            const result = component.getNewProps(oldProps, newProps, 'testName');

            expect(typeof result).toEqual('object');
        });

        it('should return null if new prop object schema does not match original props', () => {
            newProps = {
                a: false,
                b: 2,
                c: {
                    d: 'a',
                    e: 'ab',
                    f: { g: false },
                    inexistentProps: true
                }
            };

            const result = component.getNewProps(oldProps, newProps, 'testName');
            expect(result).toBe(null);
        });

        it('should return null if new prop object has dangerouslySetInnerHTML key', () => {
            oldProps.dangerouslySetInnerHTML = 'a';
            newProps = {
                a: false,
                b: 2,
                c: {
                    d: 'a',
                    e: 'ab',
                    f: { g: false }
                },
                dangerouslySetInnerHTML: 'b'
            };

            const result = component.getNewProps(oldProps, newProps, 'testName');
            expect(result).toBe(null);
        });

        it('should return null if new prop object has children key', () => {
            oldProps.children = createSpy();
            newProps = {
                a: false,
                b: 2,
                c: {
                    d: 'a',
                    e: 'ab',
                    f: { g: false }
                },
                children: createSpy()
            };

            const result = component.getNewProps(oldProps, newProps, 'testName');
            expect(result).toBe(null);
        });

        it('should call copyNestedArrayItems method if a prop key is an array', () => {
            const copyNestedArrayItemsStub = spyOn(component, 'copyNestedArrayItems');

            oldProps.images = [{ a: false }];
            newProps = {
                a: false,
                b: 2,
                c: {
                    d: 'a',
                    e: 'ab',
                    f: { g: false }
                },
                images: [{ a: true }]
            };

            const newArray = newProps.images;
            const originalArray = oldProps.images;

            component.getNewProps(oldProps, newProps, 'testName');
            expect(copyNestedArrayItemsStub).toHaveBeenCalledWith(newArray, originalArray);
        });

        const invalidTypes = [
            {
                value: undefined,
                type: 'undefined'
            },
            {
                value: null,
                type: 'null'
            },
            {
                value: [],
                type: 'array'
            },
            {
                value: 'props',
                type: 'string'
            },
            {
                value: 2,
                type: 'number'
            }
        ];

        using('Invalid types', invalidTypes, item => {
            it(`should return null if new prop object is type of ${item.type}`, () => {
                const result = component.getNewProps(oldProps, item.value, 'testName');
                expect(result).toBe(null);
            });
        });
    });

    describe('handleHotSpots method', () => {
        let component;
        const oldProps = {
            a: true,
            b: 1,
            c: {
                d: 'a',
                e: 'ab',
                f: { g: true }
            },
            hotSpots: ['a', 'b']
        };

        beforeEach(() => {
            const wrapper = shallow(<TestTarget />);
            component = wrapper.instance();
        });

        it('should return original hotspots if no new hotspots are passed in', () => {
            const newProps = { a: false };

            const result = component.handleHotSpots(newProps, oldProps);
            expect(result).toEqual(oldProps.hotSpots);
        });

        it('should return empty array if newProps.hotSpots is []', () => {
            const newProps = {
                a: false,
                hotSpots: []
            };

            const result = component.handleHotSpots(newProps, oldProps);
            expect(result.length).toBe(0);
        });

        it('should overwrite oldProps.hotSpots with newProps.hotSpots', () => {
            const newProps = {
                a: false,
                hotSpots: ['a', 'c']
            };

            const result = component.handleHotSpots(newProps, oldProps);
            expect(result).toBe(newProps.hotSpots);
        });
    });

    describe('copyNestedArrayItems method', () => {
        let component;

        beforeEach(() => {
            const wrapper = shallow(<TestTarget />);
            component = wrapper.instance();
        });

        it('should return a new array of copied nested objects', () => {
            const newArray = [
                { a: true },
                {
                    a: false,
                    b: true
                },
                {
                    a: {
                        a: true,
                        b: true
                    }
                }
            ];

            const oldArray = [
                { a: false },
                {
                    a: false,
                    b: false,
                    c: true,
                    d: false
                },
                {
                    a: {
                        a: false,
                        b: false,
                        c: true
                    }
                }
            ];

            const expectedResult = [
                { a: true },
                {
                    a: false,
                    b: true,
                    c: true,
                    d: false
                },
                {
                    a: {
                        a: true,
                        b: true,
                        c: true
                    }
                }
            ];

            const result = component.copyNestedArrayItems(newArray, oldArray);

            expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
        });

        it('should return a new array of copied non-object items', () => {
            const newArray = [1, 2, 3];
            const oldArray = [1, 4, 5, 6, 7];

            const expectedResult = [1, 2, 3, 6, 7];

            const result = component.copyNestedArrayItems(newArray, oldArray);
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
        });
    });
});
