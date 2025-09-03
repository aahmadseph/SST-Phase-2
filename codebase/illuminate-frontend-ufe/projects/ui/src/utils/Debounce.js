const DEFAULT_CLICK_THRESHOLD = 1000;

const Debounce = {
    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * delay ms
     * @param fn
     * @param delay
     * @returns {Function}
     */
    debounce: function (fn, delay) {
        var timer = null;

        return function () {
            var _this = this;
            var args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(_this, args);
            }, delay);

            return timer;
        };
    },
    /**
     * The point of preventDoubleClick function pretty much the same,
     * The main difference is that debounce function wait, and then call,
     * but preventDoubleClick function call, and then wait.
     * So, preventDoubleClick function is a best option to prevent occasional
     * double-click events and any events that supposed to be executed
     * only once at a time (threshold).
     * @param fn
     * @param threshold
     * @returns {Function}
     */
    preventDoubleClick: function (fn, threshold = DEFAULT_CLICK_THRESHOLD) {
        var last;
        var deferTimer;

        return function () {
            var _this = this;
            var now = +new Date();
            var args = arguments;

            if (last && now < last + threshold) {
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function () {
                    last = now;
                }, threshold);
            } else {
                last = now;
                fn.apply(_this, args);
            }
        };
    }
};

export default Debounce;
