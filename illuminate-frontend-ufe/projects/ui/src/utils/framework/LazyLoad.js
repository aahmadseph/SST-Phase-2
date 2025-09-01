import ServiceUtils from 'utils/Services';
import ReactDOM from 'react-dom';
import UI from 'utils/UI';
import Perf from 'utils/framework/Perf';
import { UserInfoCtrlrsApplied, TestTargetCtrlrsApplied, LazyLoadComplete } from 'constants/events';

/**
 * Creates the lazy loader instance.
 */

const LazyLoader = function () {
    /**
     * Sometimes images can be added to a target after its been loaded. allTargets is used to
     * maintain an array of all lazyLoad targets in case a lazy Image is added to a target that
     * has already loaded.
     */
    this.targets = [];
    this.components = [];
    this.observer = new IntersectionObserver(this._scrollCallback.bind(this), {});
};

/**
 * @param  {obj} child - DOM element
 * @param  {string} attribute - data-attribute used to find the parent element
 * @param  {string} value - value of said data-attribute
 */
LazyLoader.prototype._findParentByAttribute = function (child, attribute, value) {
    return new Promise((resolve, reject) => {
        let parent = child.parentNode;

        while (parent && parent !== document.body) {
            const parentLoadAttribute = parent.getAttribute(attribute);

            if (parentLoadAttribute) {
                if (parentLoadAttribute === 'false') {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject();
                } else if (parentLoadAttribute === value) {
                    resolve(parent);
                }
            }

            parent = parent.parentNode;
        }

        resolve(null);
    });
};

LazyLoader.prototype._scrollCallback = function (entries) {
    const intersectedEntries = entries.filter(entry => entry.isIntersecting);
    const justLoadedTargets = this.targets.filter(target => !target.loaded && intersectedEntries.some(entry => entry.target === target.container));

    if (justLoadedTargets.length) {
        UI.requestFrame(() => {
            justLoadedTargets.map(target => target.loadItems());
            this.targets = this.targets.filter(item => item.loaded === false);
        });
    }
};

/** Registers the lazy-loaded item to its associated target if its target has been stored already,
 * or else adds a new target (with its lazy-loaded item) to the target store.
 * @param  {object} itemTarget - DOM element to lazy load
 * @param  {function} callback - Callback to execute when item is ready to load
 */
LazyLoader.prototype._registerItem = function (itemTarget, callback) {
    const targets = this.targets;
    let i = 0;
    let target;

    // If targets have already been registered, but this item has not been added to one of them.
    while (i < targets.length && target === undefined) {
        /** If the item's target is already in the target store, add it to said
         * target's item store.
         */
        if (targets[i].container === itemTarget) {
            target = targets[i];
            target.items.push(callback);

            if (target.loaded) {
                callback();
            }
        }

        i++;
    }

    /**
     * If the item was not added per above, then the item's target has not been stored yet.
     * Add the target and its associated item.
     */
    if (target === undefined) {
        target = {
            container: itemTarget,
            items: [callback],
            loaded: false,
            loadItems: function () {
                // Resolve all of the target's lazy loaded items
                for (let x = 0, max = this.items.length; x < max; x += 1) {
                    this.items[x]();
                }

                // Mark as loaded
                this.loaded = true;

                // Visualize what is getting loaded, for development purposes only
                // this.container.style.border = '3px solid red';
                Perf.report(['Lazy Target Loaded', this.container], false);
            }
        };

        targets.push(target);
        this.observer.observe(target.container);
    }
};

/**
 * @param  {object} lazyComponent - Component instance
 * @param  {function} callback - Callback to execute when lazy loading
 */
LazyLoader.prototype.addLazyComponent = function (component, callback) {
    const componentElement = ReactDOM.findDOMNode(component);

    this._findParentByAttribute(componentElement, 'data-lload', 'comp').then(
        parent => {
            const lazyTarget = parent || componentElement;
            this._registerItem(lazyTarget, callback);
        },
        () => callback()
    );
};

LazyLoader.prototype.registerComponent = function (component) {
    this.components.push(component);
};

LazyLoader.prototype.unregisterComponent = function (component) {
    this.components = this.components.filter(registeredComponent => registeredComponent !== component);
};

LazyLoader.prototype.beginReset = function () {
    this.observer.disconnect();
    this.targets = [];
    this.observer = new IntersectionObserver(this._scrollCallback.bind(this), {});
    this.components.forEach(component => component.beginReset());
};

LazyLoader.prototype.endReset = function () {
    this.components.forEach(component => component.endReset());
};

LazyLoader.prototype.start = function () {
    // Fire lazy load check once initially
    Perf.report('LazyLoading Start');

    /** Disable lazy loading after these load events have fired.
     * It is assumed that any new images added to the page past this point are a
     * response to user actions and should therefore be loaded immediately
     */
    const shouldServiceRun = ServiceUtils.shouldServiceRun;
    const dependencies = [UserInfoCtrlrsApplied];

    if (shouldServiceRun.testTarget()) {
        dependencies.push(TestTargetCtrlrsApplied);
    }

    // Trigger lazy load complete
    Sephora.Util.onLastLoadEvent(window, dependencies, this._triggerLoadComplete.bind(this));
};

LazyLoader.prototype._triggerLoadComplete = function () {
    Perf.report('LazyLoading Complete');
    Sephora.isLazyLoadEnabled = false;
    Sephora.Util.InflatorComps.services.loadEvents[LazyLoadComplete] = true;
    window.dispatchEvent(new CustomEvent(LazyLoadComplete));
};

const LazyLoaderInstance = !Sephora.isNodeRender ? new LazyLoader() : null;

export default {
    LazyLoader,
    LazyLoaderInstance
};
