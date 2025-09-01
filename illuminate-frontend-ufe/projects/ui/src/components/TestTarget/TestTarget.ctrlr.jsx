/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import store from 'Store';
import watch from 'redux-watch';
import testTargetUtils from 'utils/TestTarget';
import TestTargetActions from 'actions/TestTargetActions';
import Helpers from 'utils/Helpers';
import deepExtend from 'utils/deepExtend';
import bccTestsUtil from 'utils/bccTests';
import Location from 'utils/Location';
import PropTypes from 'prop-types';
import BccStyleWrapper from 'components/Bcc/BccStyleWrapper/BccStyleWrapper';
import { TestTargetReady } from 'constants/events';

const { TEST_TYPES } = testTargetUtils;
const isObject = Helpers.isObject;

const areObjectsEq = (obj1, obj2) => {
    return obj1 === obj2 || JSON.stringify(obj1) === JSON.stringify(obj2);
};

class TestTarget extends BaseClass {
    state = {
        showSkeleton: !!this.props.skeleton,
        displayComponent: null,
        updateProps: null,
        componentHidden: null
    };

    asyncRender = 'TestTarget';

    loadClass = () => {
        return new Promise(resolve => {
            if (this.isBCCConfigDrivenTest) {
                resolve();
            } else {
                Sephora.Util.onLastLoadEvent(window, [TestTargetReady], () => resolve());
            }
        });
    };

    componentDidMount() {
        this.isBCCConfigDrivenTest = bccTestsUtil.findTestInObject(Sephora.configurationSettings.ABTests, this.props.testName);

        this.loadClass().then(
            () => {
                this.executeTest();

                // if this test is BCC test -> execute it and do not subscribe, since
                // it should not be overwritten by the adobe test with the same name and
                // we don't need to hide it later on SPA load as it is consistent across pages
                // https://jira.sephora.com/browse/ILLUPH-114099?focusedCommentId=1080558#comment-1080558
                if (this.isBCCConfigDrivenTest) {
                    return;
                }

                // Subscribe to T&T updates
                const testTargetWatch = watch(store.getState, 'testTarget');

                store.subscribe(
                    testTargetWatch(newState => {
                        const offersInitialized = newState.readyState === TestTargetActions.OFFERS_READY_STATES.ADOBE_TESTS_RECEIVED;

                        // adobe tests received and have been changed from the previous state
                        if (this.props.isPersistentBanner1 && Location.isContentPage()) {
                            // This if is a special case scenario for isPersistentBanner1. Because of how TestTarget is implemented we
                            // have to use this for it to work. We should revisit this and refactor whole TestTarget for it to work
                            // the right way.
                            return;
                        } else if (
                            offersInitialized &&
                            (!areObjectsEq(this.prevTestTargetOffers, newState?.offers) || this.prevTestTargetReadyState !== newState.readyState)
                        ) {
                            this.executeTest();
                            // tests has been reset
                        } else if (!offersInitialized && !newState.totalTests && !newState.receivedTest) {
                            this.setState({
                                displayComponent: null,
                                showSkeleton: false
                            });
                        }
                    }),
                    this
                );
            },
            () => {
                const { testComponent } = this.props;

                /* TODO: Find an optimal solution for edge cases where the component class may not be available yet. */
                // eslint-disable-next-line no-console
                return console.error('TestTarget: %s component class was not found, rendering empty instead.', testComponent);
            }
        );
    }

    executeTest = () => {
        const { testComponent, testEnabled, testName } = this.props;
        const {
            testTarget,
            testTarget: { offers, readyState, timeout }
        } = store.getState();
        this.prevTestTargetOffers = offers;
        this.prevTestTargetReadyState = readyState;
        const testResults = this.getTestResults(testTarget);
        const testEligible = testName && testEnabled && testResults;
        const displayComponent = testComponent;

        if (!timeout && testEligible) {
            /* Handle pre-determined test cases */
            if (testResults.currentTest.testType !== undefined) {
                switch (testResults.currentTest.testType) {
                    case TEST_TYPES.TOGGLE:
                        if (this.shouldHideComponent(testResults.currentTest.result)) {
                            this.setState({
                                componentHidden: true,
                                showSkeleton: false
                            });

                            /* If component is to be hidden, returns to remain <Empty> and sets
                            componentHidden flag to hide bccStyleWrapper. */
                            return;
                        } else {
                            this.setState({
                                displayComponent,
                                updateProps: false,
                                showSkeleton: false
                            });

                            break;
                        }
                    case TEST_TYPES.INJECT_PROPS:
                        this.injectProps(testResults);

                        break;

                    case TEST_TYPES.TOGGLE_AND_INJECT_PROPS:
                        if (this.shouldHideComponent(testResults.currentTest.result)) {
                            this.setState({
                                componentHidden: true,
                                showSkeleton: false
                            });

                            /* If component is to be hidden, returns to remain <Empty> and sets
                            componentHidden flag to hide bccStyleWrapper. */
                            return;
                        } else {
                            this.injectProps(testResults);
                        }

                        break;

                    default:
                        this.defaultToControl();

                        break;
                }

                /* Handle hard-coded tests */
            } else {
                this.setState({
                    displayComponent,
                    updateProps: { testTarget: { [testResults.testName]: testResults.currentTest } },
                    showSkeleton: false
                });
            }

            if (this.props.testCallback) {
                /* Hook to execute a callback when the test executes, useful for state changes */
                this.props.testCallback(testResults.testName);
            }
        } else {
            /* Default to control if:
             ** 1. Test is disabled
             ** 2. testName was not passed
             ** 3. No matching result in store
             ** 4. Test flag is false in store
             ** 5. T&T service timeouts
             */
            this.defaultToControl();
        }
    };

    injectProps = testResults => {
        if (testResults.currentTest.props) {
            const newProps = this.getNewProps(this.props, testResults.currentTest.props, testResults.testName);

            if (newProps) {
                const { testName, testComponent, testEnabled, ...originalProps } = this.props;
                const displayComponent = testComponent;

                this.setState({
                    displayComponent,
                    updateProps: deepExtend({}, originalProps, newProps),
                    showSkeleton: false
                });
            } else {
                this.defaultToControl();
            }
        } else {
            this.defaultToControl();
        }
    };

    getTestResults = results => {
        //TODO: BCC and API should return an array of tests
        const testNames = this.props.testName ? this.props.testName.split(',') : [];

        const testResults = [];

        testNames.forEach(name => {
            const trimmedName = name.trim();

            if (results.offers[trimmedName]) {
                testResults.push({
                    testName: trimmedName,
                    currentTest: results.offers[trimmedName]
                });
            }
        });

        if (testResults.length) {
            return testResults.pop();
        } else {
            return false;
        }
    };

    defaultToControl = error => {
        const { isBcc, testComponent } = this.props;
        const displayComponent = testComponent;
        let updateProps;

        if (isBcc) {
            updateProps = this.props;
        } else {
            updateProps = { testTarget: false };
        }

        /* Render component as control case */
        this.setState({
            displayComponent,
            updateProps,
            showSkeleton: false
        });

        if (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    /**
     * @param {object} currentTest - This test's corresponding object sent from T&T.
     */
    shouldHideComponent = currentTest => {
        return typeof currentTest.isHidden !== 'undefined' && currentTest.isHidden;
    };

    /* Checks if invalid prop structure is being added to the tested component */
    getNewProps = (oldProps, newProps, testName) => {
        const HTML_KEY = 'dangerouslySetInnerHTML';
        const CHILDREN_KEY = 'children';
        const HOTSPOTS_KEY = 'hotSpots';
        const invalidKeys = [];
        const copyNestedArrayItems = this.copyNestedArrayItems;
        const handleHotSpots = this.handleHotSpots;

        if (!isObject(oldProps) || !isObject(newProps)) {
            return null;
        }

        /* Create shallow copy to avoid mutating Redux object */
        // eslint-disable-next-line no-param-reassign
        newProps = Object.assign({}, newProps);

        (function getKeys(original, incoming) {
            Object.keys(incoming).forEach(key => {
                if (!Object.prototype.hasOwnProperty.call(original, key) || key === HTML_KEY || key === CHILDREN_KEY) {
                    // Only keys that exist in the original prop structure are permitted
                    invalidKeys.push(key);
                }

                if (Array.isArray(incoming[key]) && Array.isArray(original[key]) && key !== HOTSPOTS_KEY) {
                    /* We copy objects nested inside arrays or else they get flatten eventually when
                    the objects are merged.*/

                    incoming[key] = copyNestedArrayItems(incoming[key], original[key]);
                } else if (isObject(incoming[key])) {
                    getKeys(original[key], incoming[key]);
                }
            });

            /* Hotspots array must be handled separately */
            if (original[HOTSPOTS_KEY]) {
                newProps[HOTSPOTS_KEY] = handleHotSpots(incoming, original);
            }
        }(oldProps, newProps));

        if (invalidKeys.length === 0) {
            return newProps;
        } else {
            const warning = 'TestTarget: invalid props %s are being added to %s test, defaulting to control.';
            // eslint-disable-next-line no-console
            console.error(warning, `(${invalidKeys.join(',')})`, testName);

            return null;
        }
    };

    handleHotSpots = (incoming, original) => {
        const HOTSPOTS_KEY = 'hotSpots';

        // If there is no hotspots key, return the original
        // If a user wishes to overwrite hotSpots to zero, they must pass []
        if (original[HOTSPOTS_KEY] && !incoming[HOTSPOTS_KEY]) {
            return original[HOTSPOTS_KEY];
        } else {
            // Otherwise, always overwrite the old hotSpots with the new
            return incoming[HOTSPOTS_KEY];
        }
    };

    copyNestedArrayItems = (incoming, original) => {
        return original.map((item, index) => {
            if (isObject(item) && isObject(incoming[index])) {
                return deepExtend({}, original[index], incoming[index]);
            } else {
                return incoming[index] || item;
            }
        });
    };

    render() {
        const {
            testName, testEnabled, index, isBcc, hideTestWithoutCase, skeleton, ...defaultProps
        } = this.props;
        const { componentHidden, displayComponent, showSkeleton, updateProps } = this.state;
        let componentProps;

        if (isBcc) {
            /* BCC component renders with its original props in the case of show & hide tests. */
            componentProps = defaultProps;
        } else {
            // eslint-disable-next-line object-curly-newline
            componentProps = updateProps
                ? {
                    ...defaultProps,
                    ...updateProps
                }
                : defaultProps;
        }

        if (hideTestWithoutCase && !componentProps.testTarget) {
            return null;
        } else if (showSkeleton) {
            return skeleton;
        } else {
            const WrappedComponent = displayComponent;
            const element = displayComponent ? <WrappedComponent {...componentProps} /> : null;

            if (isBcc && !componentHidden && componentProps.styleList) {
                return <BccStyleWrapper customStyle={componentProps.styleList}>{element}</BccStyleWrapper>;
            } else {
                return element;
            }
        }
    }
}

TestTarget.propTypes = {
    testName: PropTypes.string.isRequired,
    testComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    testEnabled: PropTypes.bool.isRequired
};

export default wrapComponent(TestTarget, 'TestTarget', true);
