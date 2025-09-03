import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const BUTTON_TYPES = {
    LEFT: 'LEFT',
    NUMBER: 'NUMBER',
    RIGHT: 'RIGHT'
};

function sendAnalytics(pageName, pageIndex, buttonType) {
    const arg = buttonType === BUTTON_TYPES.NUMBER ? pageIndex : buttonType === BUTTON_TYPES.LEFT ? 'previous' : 'next';
    const prop55 = `${pageName}:pagination:${arg}`;
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            eventStrings: ['event71'],
            linkName: 'D=c55',
            actionInfo: prop55
        }
    });
}

export default {
    BUTTON_TYPES,
    sendAnalytics
};
