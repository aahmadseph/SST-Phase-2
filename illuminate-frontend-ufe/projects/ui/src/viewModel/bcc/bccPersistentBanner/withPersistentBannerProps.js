import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { p13nSelector } from 'selectors/p13n/p13nSelector';
import { sendCmsComponentEvent } from 'analytics/utils/cmsComponents';
import constants from 'constants/content';
import anaConsts from 'analytics/constants';

const {
    BANNER_TYPES: { PERSISTENT }
} = constants;

const {
    CMS_COMPONENT_EVENTS: { IMPRESSION, ITEM_CLICK }
} = anaConsts;

const { wrapHOC } = FrameworkUtils;

const functions = (dispatch, ownProps) => ({
    triggerImpression: function () {
        const { data } = ownProps;

        if (data && data.length > 0) {
            const firstBanner = data[0];

            const eventName = IMPRESSION;

            sendCmsComponentEvent({
                items: [firstBanner],
                eventName,
                sid: '',
                component: PERSISTENT,
                ignoreCMSAnalyticsFlag: true
            });
        }
    },
    triggerClick: async function (banner) {
        const { sid: clickedSid } = banner;
        const { data } = ownProps;

        if (data && data.length > 0) {
            const eventName = ITEM_CLICK;

            await sendCmsComponentEvent({
                items: data,
                eventName,
                sid: '',
                clickedSid,
                component: PERSISTENT,
                ignoreCMSAnalyticsFlag: true
            });
        }
    }
});

const connectedPersistentBanner = connect(
    createStructuredSelector({
        p13n: p13nSelector
    }),
    functions
);

const withPersistentBannerProps = wrapHOC(connectedPersistentBanner);

export {
    functions, withPersistentBannerProps
};
