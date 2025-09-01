import RmnUtils from 'utils/rmn';

class RmnEvents {
    constructor({ once, threshold, callback, ...rest } = {}) {
        this.once = once ?? true;
        this.threshold = threshold || 0.01;
        this.tracked = false;
        this.currentElement = null;
        this.eventData = {};
        this.callback = callback || (() => {});
        this.initialized = false;

        if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(entries => this.handleIntersection(entries), {
                threshold: this.threshold,
                ...rest
            });
        } else {
            this.observer = null;
        }
    }

    isInitialized() {
        return this.initialized;
    }

    observe(element) {
        if (!element) {
            return;
        }

        if (this.currentElement) {
            this.observer.unobserve(this.currentElement);
        }

        this.currentElement = element;
        this.observer.observe(element);
        this.initialized = true;
    }

    setCallback(callback) {
        this.callback = callback;
    }

    sendEvent(data) {
        RmnUtils.fireViewableImpressionEvent({ ...this.eventData, ...data });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !this.tracked) {
                this.triggerImpression();

                if (this.once) {
                    this.destroy();
                }
            }
        });
    }

    triggerImpression() {
        this.tracked = true;
        this.callback();
    }

    destroy() {
        if (this.currentElement) {
            this.observer.unobserve(this.currentElement);
            this.observer.disconnect();
            this.currentElement = null;
            this.observer = null;
            this.callback = null;
        }
    }
}

export default RmnEvents;
