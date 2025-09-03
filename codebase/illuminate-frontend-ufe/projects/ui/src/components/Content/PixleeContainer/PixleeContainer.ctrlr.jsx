/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import processEvent from 'analytics/processEvent';
import analyticsConstants from 'analytics/constants';

import { Box, Divider } from 'components/ui';

const {
    ASYNC_PAGE_LOAD,
    LINK_TRACKING_EVENT,
    UGC_DYNAMIC_WIDGET,
    PAGE_TYPES,
    PAGE_NAMES,
    Event: { EVENT_71, UGC_COMPONENT_INTERACTION }
} = analyticsConstants;
const PIXLEE_VARIANT = {
    SIMPLE: 'simple',
    CATEGORY: 'category'
};

const PixleeEventMap = {
    photoOpened: ({ products = [] }) => {
        const productStrings = products.map(({ sku }) => `;${sku};;;;eVar26=${sku}`);

        return [
            [
                LINK_TRACKING_EVENT,
                {
                    data: {
                        actionInfo: UGC_DYNAMIC_WIDGET.IMAGE_CLICKED,
                        linkName: UGC_DYNAMIC_WIDGET.IMAGE_CLICKED,
                        eventStrings: [EVENT_71, UGC_COMPONENT_INTERACTION]
                    }
                }
            ],
            [
                ASYNC_PAGE_LOAD,
                {
                    data: {
                        productStrings,
                        pageName: `${PAGE_TYPES.UGC_MODAL}:${PAGE_NAMES.UGC_MODAL}:n/a*`,
                        pageType: PAGE_TYPES.UGC_MODAL,
                        pageDetail: PAGE_NAMES.UGC_MODAL
                    }
                }
            ]
        ];
    },
    widgetNavigated: () => [
        [
            LINK_TRACKING_EVENT,
            {
                data: {
                    actionInfo: UGC_DYNAMIC_WIDGET.SCROLL_MORE,
                    linkName: UGC_DYNAMIC_WIDGET.SCROLL_MORE,
                    eventStrings: [EVENT_71, UGC_COMPONENT_INTERACTION]
                }
            }
        ]
    ],
    photoChanged: () => [
        [
            LINK_TRACKING_EVENT,
            {
                data: {
                    actionInfo: UGC_DYNAMIC_WIDGET.SWIPE,
                    linkName: UGC_DYNAMIC_WIDGET.SWIPE,
                    eventStrings: [EVENT_71, UGC_COMPONENT_INTERACTION],
                    pageName: `${PAGE_TYPES.UGC_MODAL}:${PAGE_NAMES.UGC_MODAL}:n/a*`,
                    pageType: PAGE_TYPES.UGC_MODAL,
                    pageDetail: PAGE_NAMES.UGC_MODAL,
                    world: 'n/a'
                }
            }
        ]
    ],
    ctaClicked: ({ ctaUrl }) => {
        const match = /(?:\?skuId=)(\d*)/.exec(ctaUrl);
        const skuID = match && match[1];

        return [
            [
                LINK_TRACKING_EVENT,
                {
                    data: {
                        productStrings: [`;${skuID};;;;eVar26=${skuID}`],
                        actionInfo: UGC_DYNAMIC_WIDGET.SEE_DETAILS,
                        linkName: UGC_DYNAMIC_WIDGET.SEE_DETAILS,
                        eventStrings: [EVENT_71, UGC_COMPONENT_INTERACTION],
                        pageName: `${PAGE_TYPES.UGC_MODAL}:${PAGE_NAMES.UGC_MODAL}:n/a*`,
                        pageDetail: PAGE_NAMES.UGC_MODAL,
                        world: 'n/a'
                    }
                }
            ]
        ];
    }
};

function listenPixleeEvents({ data: json }) {
    // https://developers.pixlee.com/docs/pixlee-widget-events
    if (typeof json === 'string') {
        let msg;
        try {
            msg = JSON.parse(json);
        } catch {
            return;
        }

        const { eventName, data: eventData } = msg;

        if (!PixleeEventMap[eventName]) {
            return;
        }

        PixleeEventMap[eventName](eventData).forEach(args => processEvent.process(...args));
    }
}

class PixleeContainer extends BaseClass {
    componentDidMount() {
        if (window.Pixlee) {
            this.loadPixleeContainer();
        } else {
            window.addEventListener('PixleeLoaded', this.loadPixleeContainer);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('message', listenPixleeEvents);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.widgetId !== this.props.widgetId) {
            this.loadPixleeContainer();
        }
    }

    loadPixleeContainer = () => {
        const { containerId, widgetId, variant } = this.props;

        if (variant === PIXLEE_VARIANT.SIMPLE) {
            window.Pixlee.addSimpleWidget({
                containerId,
                widgetId: widgetId,
                accountId: Sephora.configurationSettings.pixleeAccountId || 0,
                subscribedEvents: Object.keys(PixleeEventMap)
            });
        }

        window.addEventListener('message', listenPixleeEvents);
        window.Pixlee.resizeWidget();
    };

    render() {
        return (
            <>
                <Box
                    id={this.props.containerId}
                    marginX={['-container', 0]}
                    overflow='hidden'
                    css={{ '&:empty + *': { display: 'none' } }}
                />
                <Divider
                    marginTop={6}
                    marginBottom={[4, 5]}
                />
            </>
        );
    }
}

PixleeContainer.propTypes = {
    containerId: PropTypes.string,
    widgetId: PropTypes.string,
    variant: PropTypes.oneOf([PIXLEE_VARIANT.SIMPLE, PIXLEE_VARIANT.CATEGORY])
};

PixleeContainer.defaultProps = {
    variant: PIXLEE_VARIANT.SIMPLE
};

export default wrapComponent(PixleeContainer, 'PixleeContainer', true);
