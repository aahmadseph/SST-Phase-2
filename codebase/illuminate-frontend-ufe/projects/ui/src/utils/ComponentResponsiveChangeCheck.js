import { breakpoints } from 'style/config';

/**
 * @class ComponentResponsiveChangeCheck
 * @description A class to check the breakpoint and call a callback function when the breakpoint changes.
 * @param {string} breakpoint - The breakpoint to check.
 * Valid values: xsMax, smMin, smMax, mdMin, mdMax, lgMin
 * Reference: style/config.js
 * xsMax = `(max-width: 767px)`
 * smMin = `(min-width: 768px)`
 * smMax = `(max-width: 991px)`
 * mdMin = `(min-width: 992px)`
 * mdMax = `(max-width: 1199px)`
 * lgMin = `(min-width: 1200px)`
 * @param {function} callback - The callback function to call when the breakpoint changes.
 * @param {number} debounceDelay - The debounce delay in milliseconds.
 *
 */
class ComponentResponsiveChangeCheck {
    constructor(breakpoint, callback, debounceDelay = 100) {
        if (!breakpoint || !callback || typeof callback !== 'function') {
            throw new Error('Breakpoint and a callback function are required.');
        }

        this.breakpoint = breakpoint;
        this.callback = callback;
        this.debounceDelay = debounceDelay;

        this.isMatch = false;
        this.debouncedResizeHandler = ComponentResponsiveChangeCheck.debounce(this.checkView.bind(this), this.debounceDelay);

        this.initializeView();
    }

    checkView() {
        const isMatch = window.matchMedia(breakpoints[this.breakpoint]).matches;

        if (isMatch !== this.isMatch) {
            this.isMatch = isMatch;
            this.callback(isMatch);
        }
    }

    triggerCallback() {
        this.callback(this.isMatch);
    }

    initializeView() {
        const isMatch = window.matchMedia(breakpoints[this.breakpoint]).matches;
        this.isMatch = isMatch;

        this.callback(isMatch);

        window.addEventListener('resize', this.debouncedResizeHandler);
    }

    cleanup() {
        window.removeEventListener('resize', this.debouncedResizeHandler);
    }

    static debounce(func, delay) {
        let timeout;

        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }
}

export default ComponentResponsiveChangeCheck;
