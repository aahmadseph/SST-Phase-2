import { sendCmsComponentEvent } from 'analytics/utils/cmsComponents';

import anaConsts from 'analytics/constants';

const {
    CMS_COMPONENT_EVENTS: { IMPRESSION, ITEM_CLICK }
} = anaConsts;

const defaultEventData = {
    eventName: IMPRESSION
};

class CmsComponentEvents {
    constructor(options = {}) {
        this.callback = options.callback || (() => {});
        this.once = options.once || true;
        this.threshold = options.threshold || 0.5;
        this.tracked = false;
        this.currentElement = null;
        this.eventData = { ...defaultEventData, ...options.eventData };

        this.observer = new IntersectionObserver(entries => this.handleIntersection(entries), { threshold: this.threshold });
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
    }

    sendEvent(extraData = {}, isClick = false) {
        const eventName = isClick ? ITEM_CLICK : IMPRESSION;
        sendCmsComponentEvent({ ...this.eventData, ...extraData, eventName });
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
        }

        this.currentElement = null;
    }
}

export default CmsComponentEvents;
