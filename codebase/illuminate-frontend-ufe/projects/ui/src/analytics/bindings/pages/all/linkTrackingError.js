import anaUtils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import deepExtend from 'utils/deepExtend';

/**
 * Merge the properties set here into the
 * event object that was created earlier.
 * @param  {object} data Event specific data
 */
function analyticsFunction(data) {
    const previousEventData = anaUtils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);
    const pageInfo = anaUtils.getPageInfo();

    var newEventData = {
        eventInfo: {
            attributes: {
                eVar63: 'D=g',
                errorMessages: data.errorMessages,
                validationErrorMessages: data.validationErrorMessages,
                languageLocale: digitalData.page.attributes.languageLocale,

                //This gets reset (or not) earlier, so just pass the current value
                pageName: data?.pageName || pageInfo?.pageName,
                experience: digitalData.page.attributes.experience,
                previousPage: data.previousPage || digitalData.page.attributes.previousPageData.pageName,
                platform: digitalData.page.attributes.platform,
                urlWithoutQuery: window.location.host,
                pageType: data.pageType || previousEventData.eventInfo.attributes.pageType,
                pageDetail: data.pageDetail || previousEventData.eventInfo.attributes.pageDetail
            }
        }
    };
    //Update old data with new
    deepExtend(previousEventData, anaUtils.removeUndefinedItems(newEventData));
}

export default analyticsFunction;
