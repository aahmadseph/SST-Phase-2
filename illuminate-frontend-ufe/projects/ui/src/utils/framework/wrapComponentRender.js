/* eslint-disable prefer-const */
/*eslint no-console: 0*/
/*eslint max-len: 0*/

/*eslint brace-style: 0*/
/*eslint quotes: 0*/
/* eslint-disable guard-for-in */
/* eslint-disable complexity */
import logError from 'utils/framework/logError';
import React from 'react';
import ReactDOM from 'react-dom/server';
import bccTestsUtil from 'utils/bccTests';
import safelyReadProp from 'analytics/utils/safelyReadProperty';

import { isUfeEnvQA, isUfeEnvLocal, isNodeEnvProduction } from 'utils/Env';
import Performance from 'utils/framework/performance/Performance';

function getCacheKey(cacheKeyIn) {
    const params = global.Sephora.renderQueryParams;

    // TODO add in language for FR CA
    return params.channel + params.country + params.urlPath + cacheKeyIn;
}

function getSSRComponentCacheItem(cacheKey, targetArgs) {
    const realCacheKey = getCacheKey(cacheKey);

    let component;

    if (global.ssrComponentCache) {
        const componentCache = global.ssrComponentCache.get(realCacheKey);

        if (componentCache) {
            const currentPropsString = JSON.stringify(targetArgs);

            // if we get a match in props then use cached component
            if (currentPropsString === componentCache.props) {
                component = componentCache.component;
            } else {
                // not a match so delete
                global.ssrComponentCache.delete(realCacheKey);
            }
        }
    }

    return component;
}

function setSSRComponentCacheItem(cacheKey, targetArgs, compiledComponent) {
    const realCacheKey = getCacheKey(cacheKey);

    if (global.ssrComponentCache.size >= global.ssrMaxMemoryItems) {
        // we've reached out limit so purge
        const purgeCount = global.ssrPurgeItemsCount;
        const keys = global.ssrComponentCache.keys();
        let i = 0;

        while (i < purgeCount) {
            const key = keys.next().value;
            global.ssrComponentCache.delete(key);
            i++;
        }
    }

    global.ssrComponentCache.set(realCacheKey, {
        props: JSON.stringify(targetArgs),
        component: compiledComponent
    });
}

// for each new component add more line here [Name of Component, Path To Props]
// the idea to keep this format is only for readability proposes.
// its format would be changed to {
//     BccImage: ['useMap'],
//     ProductItem: ['productId', 'skuId'],
//     QuickLookModal: : [['product', 'productId'], ['currentSku', 'skuId']] // Props In Objects
// }
const uidPropertiesMap = {
    BccImage: 'useMap',
    ProductItem: 'productId:skuId',
    QuickLookModal: 'product.productId:currentSku.skuId'
};
const uidCompNames = ['BccImage', 'ProductItem', 'QuickLookModal'];

for (let i = 0; i < uidCompNames.length; i = i + 1) {
    uidPropertiesMap[uidCompNames[i]] = uidPropertiesMap[uidCompNames[i]].split(':').map(propPath => propPath.split('.'));
}

const wrapComponentRenderWrap = () => {
    /* Backend Component Rendering */
    /* In order to step through react as it render's elements put a stop point at
     * the start of ReactReconciler.mountComponent. That's line 39 in ReactReconciler.js.
     * This is called once for every ReactComponent being rendered. If a custom component
     * is being rendered it will be called twice, once for the custom component and once for
     * it's internal root component. */

    /* Life Cycle of a component */
    /* - React.createElement() is called passing the component class or a string reprisenting
     *   an HTML tag, e.g. 'div'
     * - instantiateReactComponent() receives a ReactElement and returns a "mount image"
     * - ReactCompositeComponentMixin.mountComponent() or ReactDOMComponent.Mixin.mountComponent()
     *   is called on the ReactElement instance. This initializes the component, renders markup,
     *   and registers event listeners, then returns rendered markup to be inserted into the DOM.
     * - ReactElement.type.prototype.render is called during the mounting process for
         ReactComponents. This is the component's render function.
     * - The render function calls its children's React.createElement() functions. The nested
     *   nature of JSX means that createElement() will be called for child elements before their
     *   parent element in the case of regular HTML tags, and elements being nested for
     *   transclusion in component tags. A component's non-transcluded child elements will be
     *   called when it's render function is run. This can mean the order in which react
     *   element's are created is somewhat unpredictable, but has the benefit of not initializing
     *   the bulk of a component until it is rendered.
     * - If the element being called is a component:
     *   - instantiateReactComponent() is now called on its root element
     *   - ReactDOMComponent.Mixin.mountComponent() is called for the root element
     *   - ReactMultiChild.Mixin.mountChildren() is called for the root element, which calls
     *     instantiateReactComponent() for each child element.
     *   - ReactCompositeComponentMixin.mountComponent() or
     *     ReactDOMComponent.Mixin.mountComponent() is called for each element
     *   - ReactElement.type.prototype.render is called during the mounting process and the
     *     cycle continues
     */

    /*
     * The following characters must be escaped to allow the component JSON to be written out as js
     * in the page.
     *
     * For info no \u2028 and \u2029 see http://timelessrepo.com/json-isnt-a-javascript-subset
     */
    let escapedCharacters = /([\/'"\u2028\u2029\\])/g;
    const LocalOrQAEnvironment = isUfeEnvQA || isUfeEnvLocal;
    let rootCompCount = 0;

    function getRootCompCount() {
        return rootCompCount;
    }

    function setRootCompCount(count) {
        rootCompCount = count;
    }

    /**
     * // LINK REACT FROM THE SERVER TO THE CLIENT //
     * ****************************************
     * @param {*} isRootComponent Flag that indicates wheter a component is RootComponent
     * @param {*} rootComp The actual RootComponent
     * @param {*} originalProps  original properties
     * @param {*} target it would be the 'this' object or the render function if it's a functional component
     * @returns {*} virtual dom element
     */
    function linkReact(isRootComponent, rootComp, originalProps, target) {
        let props = originalProps;

        if (Sephora.isNodeRender && isRootComponent) {
            if (!rootComp.asyncRender) {
                // Assign component a unique sephora id for linking it up in the front end from linkJSON
                let id = rootCompCount++;
                props['data-sephid'] = id;

                if (rootComp.props.children) {
                    console.error(
                        rootComp +
                            ': Component should not use transclusion. It is not possible to pass this.props.children between server and client.\n' +
                            rootComp.class +
                            ' at data-sephid=' +
                            id +
                            ' will not render with its props client side.'
                    );
                    rootComp.props = null;
                }

                if (!rootComp.hasCtrlr) {
                    console.error(
                        'wrapComponentRender: The component "' +
                            target.class +
                            '" inherits from root parent component "' +
                            rootComp.class +
                            '". ' +
                            rootComp.class +
                            ' is not recognized as a root component since it has no controller. Setup ' +
                            rootComp.class +
                            ' as a root component or wrap ' +
                            target.class +
                            ' in a native html element.'
                    );
                }
            } else {
                // TODO: Leave the code below commented out for now. Its likely to be useful in future refactors.
                // newVDomElement.props = Object.assign({}, originalVDomElement.props);
                //
                // // Duplicate component's children property
                // var children = newVDomElement.props.children;
                // if (children) {
                //     children = [].concat(children);
                // } else {
                //     children = [];
                // }
                //
                // // Add script element as the last child of the component to tell inflate comps to render this component ASAP
                // // This is for high priority components that require personalized data to render
                // children.push(React.createElement('script', {
                //     dangerouslySetInnerHTML: {
                //         __html: 'Sephora.Util.InflatorComps.queue(\'' + rootComp.class + '\', \'' + JSON.stringify(rootComp.props) + '\', \'' + rootComp.asyncRender + '\');'
                //     }
                // }));
                //
                // newVDomElement.props.children = children;

                props.dangerouslySetInnerHTML.__html +=
                    "<script>Sephora.Util.InflatorComps.queue('" +
                    rootComp.class +
                    "', '" +
                    JSON.stringify(rootComp.props).replace(escapedCharacters, '\\$1') +
                    "', '" +
                    rootComp.asyncRender +
                    "');</script>";
            }
        }

        return props;
    }

    // Functions should only be added to WrapReact when server initializes.
    // Adding a function when requests are recieved will cause a memory leak.
    function buildDataComp(props, comps) {
        // eslint-disable-next-line no-param-reassign
        comps = comps || [];
        props['data-comp'] = '';

        for (let i = 0; i < comps.length; i = i + 1) {
            /**
             * Initial Issue: https://jira.sephora.com/browse/UA-2326
               Ensures functional components like BannerFlush show up correctly in the DOM:
                    - Uses a clean name (not raw function source)
                    - Preserves full component hierarchy (e.g. "BannerFlush BaseComponent")
               This prevents source code leaks and helps with debugging.
            */
            if (typeof comps[i] === 'string') {
                props['data-comp'] += comps[i] + ' ';
            } else {
                props['data-comp'] += (comps[i].class || 'UnknownComponent') + ' ';
            }
        }

        return props;
    }

    function buildDataUid(comp, vDOMprops) {
        let uidProperties = uidPropertiesMap[comp.class];

        if (Array.isArray(uidProperties)) {
            let uidString = '';

            for (let i = 0; i < uidProperties.length; i = i + 1) {
                var uidPropPathArr = uidProperties[i];
                let uidValue = comp.props[uidPropPathArr[0]];

                // if uidValue is an object and if it was provided another prop to check
                // then we get that prop
                if (uidPropPathArr[1] && uidValue instanceof Object) {
                    // pass first of them
                    uidValue = uidValue[uidPropPathArr[1]];
                }

                uidValue && (uidString += uidValue + ' ');
            }

            if (uidString !== '') {
                vDOMprops['data-uid'] = uidString.trim();
            }
        }

        return vDOMprops;
    }

    /**
     * HANDLE GLOBAL ACCESS OF COMPONENTS
     * @param {*} compStore object where the target component stores its props
     * @param {*} props virtual dom element props
     * @returns {*} props
     */
    function handleGlobalAccess(compStore, props) {
        if (!Sephora.isNodeRender) {
            // If rendering component on the front end
            for (let i = 0; i < compStore.comps.length; i = i + 1) {
                let compInstance = compStore.comps[i];

                if (compInstance.state && compInstance.state.globalRef) {
                    // Apply global instance attributes to react element
                    Object.assign(props, compInstance.state.globalRef.attrs);
                }
            }
        } else if (!Sephora.checkForRoot) {
            // checkForRoot ensures that this is only appled to images that will not be re-rendered on the front end
            // If rendering component on the backend put in a flag so it can be added to instances
            // array on the front end
            let ref = '';

            for (let i = 0; i < compStore.comps.length; i = i + 1) {
                let compInstance = compStore.comps[i];

                if (compInstance.globalAccess) {
                    ref += compInstance.class;
                }
            }

            if (ref.length) {
                props['data-ref'] = ref;
            }
        }

        return props;
    }

    function recordRenderTime(instance, comp) {
        if (comp.startTimeInstance === instance) {
            let endTime = performance.now(),
                renderTime = endTime - comp.startTime;

            // if(instance.class === 'BccCarousel') console.log(instance.class + ' endTime: ' + endTime + ' inclusiveRenderTime Added: ' + inclusiveRenderTime);
            comp.renderTime += renderTime;
            Sephora.Util.InflatorComps.totalInclusiveRenderTime += renderTime;
            comp.startTimeInstance = undefined;
        }
    }

    function shouldBeNotAsync(testName) {
        return bccTestsUtil.findTestInObject(Sephora.configurationSettings.ABTests, testName);
    }

    function setupRenderTime(compClass, comp) {
        let originalcomponentDidMount = compClass.prototype.componentDidMount,
            originalcomponentDidUpdate = compClass.prototype.componentDidUpdate;
        compClass.prototype.componentDidMount = function () {
            if (originalcomponentDidMount) {
                originalcomponentDidMount.apply(this);
            }

            recordRenderTime(this, comp);
        };
        compClass.prototype.componentDidUpdate = function () {
            if (originalcomponentDidUpdate) {
                originalcomponentDidUpdate.apply(this, arguments);
            }

            recordRenderTime(this, comp);
        };
    }

    function unsubscribeOnUnmount(compClass) {
        let originalcomponentDidMount = compClass.prototype.componentDidMount,
            originalcomponentWillUnmount = compClass.prototype.componentWillUnmount;

        compClass.prototype.componentDidMount = function () {
            this['__ufe__'] = {
                ...(this['__ufe__'] || {}),
                unsubscribers: []
            };

            if (originalcomponentDidMount) {
                originalcomponentDidMount.apply(this);
            }
        };

        compClass.prototype.componentWillUnmount = function () {
            if (originalcomponentWillUnmount) {
                originalcomponentWillUnmount.apply(this, arguments);
            }

            (this['__ufe__']?.unsubscribers || []).forEach(unsubscribe => {
                if (typeof unsubscribe === 'function') {
                    unsubscribe();
                }
            });
        };
    }

    function wrapComponentRender(compClass) {
        let componentData,
            isFunctional = compClass.isFunctional,
            originalPropStore,
            originalRender,
            isTestTarget;

        if (isFunctional) {
            originalPropStore = originalRender = compClass;
        } else {
            originalPropStore = compClass.prototype;
            originalRender = compClass.prototype.render;
        }

        !isFunctional && unsubscribeOnUnmount(compClass);

        isTestTarget = originalPropStore.asyncRender && originalPropStore.asyncRender === 'TestTarget';

        if (LocalOrQAEnvironment && !Sephora.isNodeRender) {
            componentData = Sephora.performance.renderTime.getComponentDataByName(originalPropStore.class);

            if (!componentData.counter && !isFunctional) {
                setupRenderTime(compClass, componentData);
            }
        }

        let renderWrapper = function renderWrapper(targetProps) {
            let start = 0;

            if (LocalOrQAEnvironment) {
                start = Performance.now();
            }

            let originalVDomElement,
                isRootComponent,
                startTime,
                target,
                constructorTarget,
                runOriginalRender = function () {
                    if (Sephora.isNodeRender) {
                        if (target.hasCtrlr) {
                            // Transform component into sync if it's BCC Driven.
                            if (isTestTarget && shouldBeNotAsync(targetProps.testName)) {
                                target.asyncRender = null;
                            }

                            /* TODO: Use logger / debug switch when ILLUPH-82156 is done. */
                            if (!isNodeEnvProduction && Sephora.checkForRoot && target.asyncRender) {
                                /**
                                 * Async components will not be rendered asynchronously if the
                                 * component is child of a root component.
                                 * See ILLUPH-82153 for more information.
                                 */
                                console.warn(`Async component [${target.class}] is child of a root component, it will not render asynchronously.`);
                            }

                            if (!Sephora.checkForRoot) {
                                isRootComponent = true;

                                // This disables check for root so that render functions run by
                                // the subsequent ReactDOM.renderToString don't go through this same
                                // function.
                                Sephora.checkForRoot = target;
                                // component is setup for component cache
                                const cacheComponent = global.ssrComponentCache && constructorTarget.componentCacheKey;

                                if (cacheComponent) {
                                    // get from cache
                                    const memoryComponentItem = getSSRComponentCacheItem(constructorTarget.componentCacheKey, targetProps);

                                    if (memoryComponentItem) {
                                        // have item and props have not changed, so return cached component
                                        Sephora.checkForRoot = null;

                                        //console.log('cache hit');
                                        return memoryComponentItem;
                                    }
                                }

                                // no cached component so render the component
                                let createdReactElement = React.createElement(target.classRef || constructorTarget, targetProps),
                                    componentHTML = ReactDOM.renderToString(createdReactElement),
                                    compiledComponent = React.createElement('div', { dangerouslySetInnerHTML: { __html: componentHTML } });

                                if (cacheComponent) {
                                    // store the component
                                    setSSRComponentCacheItem(constructorTarget.componentCacheKey, targetProps, compiledComponent);
                                }

                                Sephora.checkForRoot = null;

                                return compiledComponent;
                            }
                        }

                        // not a root component
                        if (global.ssrComponentCache && target.componentCacheKey) {
                            // get from cache
                            const memoryComponentItem = getSSRComponentCacheItem(target.componentCacheKey, targetProps);

                            if (memoryComponentItem) {
                                // have item and props have not changed, so return cached component
                                return memoryComponentItem;
                            }

                            // not cached yet, so render and caches
                            const renderedComponent = originalRender.apply(target, targetProps);
                            setSSRComponentCacheItem(target.componentCacheKey, targetProps, renderedComponent);

                            return renderedComponent;
                        }
                    }

                    return originalRender.apply(target, [targetProps]);
                };

            if (isFunctional) {
                target = compClass;
                constructorTarget = target;
            } else {
                target = this;
                // eslint-disable-next-line no-param-reassign
                targetProps = this.props;
                constructorTarget = target.constructor;
            }

            if (!Sephora.isNodeRender && LocalOrQAEnvironment) {
                startTime = performance.now();

                if (!componentData.startTimeInstance) {
                    componentData.startTime = startTime;
                    componentData.startTimeInstance = target;
                }
            }

            if (LocalOrQAEnvironment) {
                const duration = Performance.now() - start;
                Sephora.performance.renderTime.wrapComponentRender += duration;
            }

            // WRAP PRODUCTION COMPONENT RENDERING IN TRY...CATCH... //
            // ***************************************************** //
            if (isNodeEnvProduction) {
                try {
                    originalVDomElement = runOriginalRender();
                } catch (e) {
                    const additionalInformation = {
                        source: 'wrapComponentRender.js',
                        compClass,
                        compTarget: constructorTarget
                    };
                    logError(e, additionalInformation);

                    return null;
                }
            } else {
                originalVDomElement = runOriginalRender();
            }

            if (LocalOrQAEnvironment) {
                start = Performance.now();
            }

            // For render time performance logging
            if (!Sephora.isNodeRender && LocalOrQAEnvironment) {
                let renderFunctionTime = performance.now() - startTime;
                componentData.renderFunctionTime += renderFunctionTime;
                componentData.counter++;
                Sephora.Util.InflatorComps.totalRenderTime += renderFunctionTime;
            }

            // Here on we deal with a react element
            let newVDomElement, rootComp, compStore, parentCompRef;

            // IF RENDER RETURNS 'NULL' OR 'FALSE' //
            // *********************************** //
            // React allows you to pass 'null' or 'false' if you don't want the component to
            // render. When this happens server side react adds an empty div with the comment
            // <!-- react-empty: 1 -->
            // Since we still need to hook up our component on the front end we instead generate
            // an empty div to act as our front end hookup target element. For more information see
            // ILLUPH-76784.
            // for functional components 'this' would be undefined so for those cases we are not checking for this.
            // TODO: see if we can use originalPropStore instead of this.
            if (Sephora.isNodeRender && originalVDomElement === null && target.hasCtrlr && !Sephora.checkForRoot) {
                originalVDomElement = React.createElement('div');
            } else if (originalVDomElement === null) {
                return null;
            }
            // *********************************** //

            // UPDATE VDOM ELEMENT AND VDOM ELEMENT PROPS //
            // ****************************************** //

            // Create a copy of the vDOM element, and vDom element props.
            // original virtual DOM is immutable so in order to manupulate
            // its properties its necessary to clone it
            newVDomElement = Object.assign({}, originalVDomElement);
            newVDomElement.props = Object.assign({}, originalVDomElement.props);

            compStore = newVDomElement.props;
            parentCompRef = targetProps.comps;

            // If the initial element of the root component is itself a component, e.g.
            // <Component>, rather than an html element, e.g. <div>
            // wrap the render function of the initial element instead.

            // newVDomElement is a copy of the virtual DOM element of the components first child.
            // If its type is set to functional then it is a custom component (not sure what the check for object is doing)
            // When typeof newVDomElement.type === 'object' it means it's a functional component's output
            // var isClassCompOutput = typeof newVDomElement.type === 'function';
            // var isFuncCompOutput = typeof newVDomElement.type === 'object';
            // var isSymbolCompOutput = typeof newVDomElement.type === 'symbol';
            var isLeafComponent = typeof newVDomElement.type === 'string';

            /**
            Work note related to the issue noted in https://jira.sephora.com/browse/UA-2326

            **Problems:**
            1. **Function Source Leakage:**
            - Full function source was injected into the DOM due to storing raw functions in `comps`.
            2. **Broken Component Hierarchy:**
            - `data-comp` only showed leaf nodes (e.g., "BaseComponent" instead of "ProductTile BaseComponent").
            - Caused by prematurely deleting the `comps` prop.

            **Solutions:**
            1. **Use Clean References:**
            - For functional components, use `target.class`, `displayName`, or `name` instead of raw functions.
            - For class components, continue using the instance object.
            - Prevents leaking function source to the DOM.

            2. **Preserve Hierarchy:**
            - Stop deleting `newVDomElement.props.comps` in non-leaf components.
            - Only clean up at the leaf level to retain full ancestry in `data-comp`.

            3. **Support Mixed Types:**
            - Updated `buildDataComp` to handle both string names and objects.

            **Result:**
            Proper component chains like `"ProductTile BaseComponent"` are shown in the DOM
            without exposing sensitive source code like full source code for some functional components.
            */

            if (!isLeafComponent) {
                // Create componentRef with fallbacks for functional components
                const componentRef = target.isFunctional ? target.class || target.displayName || target.name || 'UnknownFunctional' : target;

                // Update component hierarchy
                compStore.comps = parentCompRef ? [...parentCompRef, componentRef] : [componentRef];

                return newVDomElement;
            }
            // delete here all the non-canonical props

            // If the initial element is a standard HTML element and this component is the
            // initial element of another component
            // Create componentRef once for both functional and class components
            const componentRef = target.isFunctional ? target.class || target.displayName || target.name || 'UnknownFunctional' : target;

            // Update component hierarchy by pushing the componentRef into the comps array
            compStore.comps = parentCompRef ? [...parentCompRef, componentRef] : [componentRef];

            rootComp = compStore.comps[0];

            // TODO: Checkout markup = ReactMarkupChecksum.addChecksumToMarkup(markup); to see if they have any helper functions for adding content to rendered HTML strings
            newVDomElement.props = linkReact(isRootComponent, rootComp, newVDomElement.props, target);

            /**
             * DISPLAY COMPONENT NAMES AND UNIQUE IDS FOR AUTOMATED TESTING
             * This is enabled by setting AUTOMATION_TARGETS=true when starting node
             * Wrap react so that component names are added to component elements
             * This is used in development mode and also as targeting for the automated testing team
             */
            if (!isRootComponent && Sephora.debug && Sephora.debug.displayAutomationAttr) {
                newVDomElement.props = buildDataComp(newVDomElement.props, compStore.comps);
                newVDomElement.props = buildDataUid(compStore.comps[0], newVDomElement.props);
            }

            newVDomElement.props = handleGlobalAccess(compStore, newVDomElement.props);

            // We don't want Host components to have comps prop.
            delete newVDomElement.props.comps;

            if (LocalOrQAEnvironment) {
                const duration = Performance.now() - start;
                Sephora.performance.renderTime.wrapComponentRender += duration;
                Sephora.performance.renderTime.wrapComponentRenderCallsCounter++;
            }

            return newVDomElement;
        };

        return renderWrapper;
    }

    function isObject(val) {
        return (typeof val === 'object' || typeof val === 'function') && val !== null;
    }

    function isFunction(val) {
        return typeof val === 'function';
    }

    function isDate(val) {
        return val instanceof Date;
    }

    const typeWeights = new Map([
        ['boolean', 4],
        ['number', 3],
        ['undefined', 2],
        ['string', 1]
    ]);

    function convertTypeToWeight(value) {
        return typeWeights.get(typeof value) || 0;
    }

    const MAX_DEPTH_OF_CHECK = 6;

    function logShouldComponentUpdateIssue({ type }) {
        if (Sephora.isNodeRender || !LocalOrQAEnvironment) {
            return;
        }

        if (!Sephora.performance.shouldComponentUpdateIssues) {
            Sephora.performance.shouldComponentUpdateIssues = {};
        }

        if (!Sephora.performance.shouldComponentUpdateIssues[type]) {
            Sephora.performance.shouldComponentUpdateIssues[type] = 1;
        } else {
            Sephora.performance.shouldComponentUpdateIssues[type]++;
        }
    }

    function isReactComponents(first, second) {
        // check for Null or Undefined
        if (!first || !second) {
            return false;
        }

        if (first.$$typeof && first.$$typeof === second.$$typeof) {
            return true;
        }

        if (first._reactInternalFiber && first._reactInternalFiber === second._reactInternalFiber) {
            return true;
        }

        if (first.isFunctional && first.componentName === second.componentName) {
            return true;
        }

        return false;
    }

    function isReactRefObject(first, second) {
        if (first && second && Object.hasOwn(first, 'current') && Object.hasOwn(second, 'current')) {
            return true;
        }

        return false;
    }

    function objectsAreEqual(first, second, depthOfCheck) {
        // if both are the same React Component we should not compare them deeply,
        // otherwise it will cause infinite loop, because React Component has circular reference
        // so we just compare them shallowly and return false
        if (isReactComponents(first, second)) {
            return false;
        }

        if (isReactRefObject(first, second)) {
            return first.current === second.current;
        }

        const isFirstObject = isObject(first);
        const isSecondObject = isObject(second);

        if (
            (!isFirstObject && !isSecondObject) || // both are not objects, compare primitives
            (isDate(first) && isDate(second)) // or dates
        ) {
            return first === second;
        }

        if (!isFirstObject || !isSecondObject) {
            // one of them is not object
            return false;
        }

        if (depthOfCheck > MAX_DEPTH_OF_CHECK) {
            // do not check object up to infinite loop
            logShouldComponentUpdateIssue({ type: 'maxDepthOfCheck' });

            return false;
        }

        // Functions have to be compared shallowly since we can not evaluate their outcome
        if (isFunction(first) && isFunction(second)) {
            if (first !== second) {
                logShouldComponentUpdateIssue({ type: 'functionsAreNotEqual' });
            }

            return first === second;
        } else if (isFunction(first) || isFunction(second)) {
            // Just one is a function
            return false;
        }

        let firstProps = Object.keys(first);
        const secondProps = Object.keys(second);

        if (firstProps.length !== secondProps.length) {
            // not equal amount of properties
            return false;
        }

        if (!firstProps.length) {
            // empty objects, nothing to compare
            return true;
        }

        firstProps = firstProps.sort(function (a, b) {
            return convertTypeToWeight(first[b]) - convertTypeToWeight(first[a]);
        });

        for (let i = 0; i < firstProps.length; i++) {
            if (i > 50) {
                logShouldComponentUpdateIssue({ type: 'moreThan50Props' });
            }

            const key = firstProps[i];

            if (!Object.hasOwn(second, key)) {
                // second object does not have the key
                return false;
            }

            const firstItem = first[key];
            const secondItem = second[key];
            const objectsEqual = objectsAreEqual(firstItem, secondItem, depthOfCheck + 1);

            if (!objectsEqual) {
                // to exit from recursive loop immediately
                // throw error if objects are equal but different in key
                throw new Error(`objectsNotEqualOnSomeLevel: ${key}, depth: ${depthOfCheck + 1}`);
            }
        }

        return true;
    }

    function selectedFieldsAreEqual(oldObj, newObj, fieldsToCompare) {
        if (fieldsToCompare) {
            let newObjKeys = Object.keys(newObj);

            // always traverse state primitives from first level
            for (let i = 0; i < newObjKeys.length; i++) {
                let key = newObjKeys[i];

                if (!isObject(newObj[key])) {
                    let oldField = safelyReadProp(key, oldObj);
                    let newField = safelyReadProp(key, newObj);

                    if (oldField !== newField) {
                        return false;
                    }
                }
            }

            // plus traverse selected fields
            for (let i = 0; i < fieldsToCompare.length; i++) {
                let fieldPath = fieldsToCompare[i];
                let oldField = safelyReadProp(fieldPath, oldObj);
                let newField = safelyReadProp(fieldPath, newObj);

                if (!objectsAreEqual(oldField, newField, 0)) {
                    return false;
                }
            }
        }

        return true;
    }

    function shouldComponentUpdate(nextProps, nextState) {
        let depthOfCheck = 0;
        try {
            const statesAreEqual = this.shouldUpdateStateOn
                ? selectedFieldsAreEqual(this.state, nextState, this.shouldUpdateStateOn)
                : objectsAreEqual(this.state, nextState, depthOfCheck);

            const propsAreEqual = this.shouldUpdatePropsOn
                ? selectedFieldsAreEqual(this.props, nextProps, this.shouldUpdatePropsOn)
                : objectsAreEqual(this.props, nextProps, depthOfCheck);

            return !statesAreEqual || !propsAreEqual;
        } catch (e) {
            logShouldComponentUpdateIssue({ type: e });

            return true;
        }
    }

    function shouldPreventRender(prevProps, nextProps, shouldUpdatePropsOn) {
        var depthOfCheck = 0;
        try {
            return shouldUpdatePropsOn
                ? selectedFieldsAreEqual(prevProps, nextProps, shouldUpdatePropsOn)
                : objectsAreEqual(prevProps, nextProps, depthOfCheck);
        } catch (e) {
            return false;
        }
    }

    return {
        shouldComponentUpdate: shouldComponentUpdate,
        shouldPreventRender: shouldPreventRender,
        wrapComponentRender: wrapComponentRender,
        buildDataUid: buildDataUid,
        buildDataComp: buildDataComp,
        setRootCompCount: setRootCompCount,
        getRootCompCount: getRootCompCount,
        objectsAreEqual
    };
};

export default wrapComponentRenderWrap;
