import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import anaUtils from 'analytics/utils';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';

const { ASYNC_PAGE_LOAD, LINK_TRACKING_EVENT } = anaConsts;

class ItemSubstitutionModalBindings {
    static triggerAnalytics = (type, analyticsData) => {
        const payload = {
            data: { ...analyticsData }
        };

        processEvent.process(type, payload);
    };

    static pageLoad = data => {
        const productStrings = anaUtils.buildItemSubstitutionProductString(data);
        const eventString = anaUtils.buildItemSubstitutionEventString(data);
        const anaData = {
            linkData: anaConsts.LinkData.ITEM_SUBSTITUTION_MODAL_OPEN,
            eventStrings: eventString,
            productStrings: productStrings,
            pageName: anaConsts.PAGE_NAMES.ITEM_SUBSTITUTION_MODAL
        };

        ItemSubstitutionModalBindings.triggerAnalytics(ASYNC_PAGE_LOAD, anaData);
    };

    static editSubstituteItem = () => {
        const anaData = {
            linkData: anaConsts.LinkData.ITEM_SUBSTITUTION_EDIT_MODAL_OPEN,
            pageName: anaConsts.PAGE_NAMES.ITEM_SUBSTITUTION_MODAL
        };

        ItemSubstitutionModalBindings.triggerAnalytics(ASYNC_PAGE_LOAD, anaData);
    };

    static availableOptionsLoad = data => {
        const isSelectedSkuOOS = data.availableOptions?.currentSku?.isOutOfStock;
        const pageName = isSelectedSkuOOS
            ? anaConsts.PAGE_NAMES.ITEM_SUBSTITUTION_MODAL_AVAILABLE_OPTIONS_OOS
            : anaConsts.PAGE_NAMES.ITEM_SUBSTITUTION_MODAL_AVAILABLE_OPTIONS;
        const linkData = isSelectedSkuOOS
            ? anaConsts.LinkData.ITEM_SUBSTITUTION_MODAL_LOAD_AVAILABLE_OPTIONS_OOS
            : anaConsts.LinkData.ITEM_SUBSTITUTION_MODAL_LOAD_AVAILABLE_OPTIONS;
        const productStrings = anaUtils.buildItemSubstitutionProductString(data);
        const eventString = anaUtils.buildItemSubstitutionEventString(data);
        const anaData = {
            linkData: linkData,
            eventStrings: eventString,
            productStrings: productStrings,
            pageName: pageName
        };
        ItemSubstitutionModalBindings.triggerAnalytics(ASYNC_PAGE_LOAD, anaData);
    };

    static confirmSubstituteItems = ({ item, selectedSkuId }) => {
        const { sku, qty } = item;

        const originalSkuString = `;${sku?.skuId};${qty || 1};${sku?.salePrice || sku?.listPrice}`;
        const eventString = 'event271';
        const eVarString = `eVar26=${sku?.skuId}|eVar131=${selectedSkuId}|eVar132=${sku?.skuId}`;
        const productString = `${originalSkuString};${eventString}=1;${eVarString};`;
        const eventData = {
            actionInfo: anaConsts.LinkData.ITEM_SUBSTITUTION_MODAL_SUBSTITUTE_SELECTED,
            eventStrings: [eventString],
            productStrings: productString
        };

        ItemSubstitutionModalBindings.triggerAnalytics(LINK_TRACKING_EVENT, eventData);
    };

    static removeSubstituteItem = isManual => {
        const removalType = isManual ? 'manual' : 'basket switch';

        const eventData = {
            actionInfo: `${anaConsts.LinkData.ITEM_SUBSTITUTION_REMOVAL} ${removalType}`
        };

        ItemSubstitutionModalBindings.triggerAnalytics(LINK_TRACKING_EVENT, eventData);
    };

    static triggerErrorTracking = errorMessage => {
        const eventData = {
            fieldErrors: 'item substitution',
            bindingMethods: linkTrackingError,
            eventStrings: [anaConsts.Event.EVENT_71],
            errorMessages: errorMessage
        };
        ItemSubstitutionModalBindings.triggerAnalytics(LINK_TRACKING_EVENT, eventData);
    };

    static closeModalTracking = isViewAvailableOptions => {
        const pageName = isViewAvailableOptions
            ? anaConsts.PAGE_NAMES.ITEM_SUBSTITUTION_MODAL_AVAILABLE_OPTIONS
            : anaConsts.PAGE_NAMES.ITEM_SUBSTITUTION_MODAL;
        const linkData = isViewAvailableOptions
            ? anaConsts.LinkData.ITEM_SUBSTITUTION_MODAL_AVAILABLE_OPTIONS_CLOSE
            : anaConsts.LinkData.ITEM_SUBSTITUTION_MODAL_CLOSE;
        const eventData = {
            actionInfo: linkData,
            linkName: 'D=c55',
            pageName: pageName
        };

        ItemSubstitutionModalBindings.triggerAnalytics(LINK_TRACKING_EVENT, eventData);
    };
}

export default ItemSubstitutionModalBindings;
