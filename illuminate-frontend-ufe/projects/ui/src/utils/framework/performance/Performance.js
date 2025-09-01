/* eslint-disable class-methods-use-this, no-unused-expressions */
import RenderTime from 'utils/framework/performance/RenderTime';
import Stack from 'utils/framework/performance/Stack';
import Perf from 'utils/framework/Perf';

let _stack;
let _renderTime;
let _hooks;

if (Sephora.isNodeRender) {
    if (Sephora.isIsomorphicBuild) {
        // to be able to use import statement in the node environment
        // we need to use experimental-modules flag
        _hooks = require('perf_hooks');
    }
}

class Performance {
    constructor() {
        _stack = new Stack();
        _renderTime = new RenderTime();
    }

    get stack() {
        return _stack;
    }

    get renderTime() {
        return _renderTime;
    }

    static initialize = () => {
        Sephora.performance = new Performance();
        Perf;
    };

    static now = () => {
        if (Sephora.isNodeRender) {
            if (Sephora.isIsomorphicBuild) {
                return _hooks.performance.now();
            } else {
                return global.window.performance.now();
            }
        } else {
            return window.performance.now();
        }
    };

    clear = () => {
        _stack.clear();
        _renderTime.clear();
    };
}

export default Performance;
