import anaConsts from 'analytics/constants';
import analyticsUtils from 'analytics/utils';
import processEvent from 'analytics/processEvent';
import checkoutUtils from 'utils/Checkout';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';
import ErrorsActions from 'actions/ErrorsActions';
import ErrorConstants from 'utils/ErrorConstants';
import store from 'Store';
import orderUtils from 'utils/Order';

const { hasHalAddress } = orderUtils;

export default (function () {
    const ERROR_LEVEL = ErrorConstants.ERROR_LEVEL;

    const methods = {
        setRopisData: function () {
            digitalData.page.pageInfo.pageName = anaConsts.PAGE_NAMES.ROPIS_CHECKOUT;
        },

        setPageName: function (focus, checkoutPath) {
            if (focus.shipAddress && !checkoutUtils.isShipAddressComplete()) {
                digitalData.page.pageInfo.pageName = anaConsts.PAGE_NAMES.SHIPPING_ADD_ADDRESS;
            } else {
                digitalData.page.pageInfo.pageName = analyticsUtils.convertName(checkoutPath);
            }
        },

        setPageType: () => {
            digitalData.page.category.pageType = anaConsts.PAGE_TYPES.CHECKOUT;
        },

        processAsyncPageLoad: function (checkoutPath, pageTypeString = anaConsts.PAGE_TYPES.CHECKOUT) {
            const pageDetail = analyticsUtils.convertName(checkoutPath);
            const name = `${pageTypeString}:${pageDetail}:n/a:*`;

            const eventStrings = [anaConsts.Event.SC_CHECKOUT];

            if (hasHalAddress()) {
                eventStrings.push(anaConsts.Event.EVENT_247);
            }

            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: name,
                    previousPageName: digitalData.page.attributes.sephoraPageInfo.pageName,
                    eventStrings,
                    pageType: pageTypeString,
                    pageDetail
                }
            });

            // Update page name so subsequent PAGE_LOAD and ASYNC_PAGE_LOAD calls have the proper previous page name (c6).
            digitalData.page.attributes.sephoraPageInfo.pageName = name;
            digitalData.page.pageInfo.pageName = pageDetail;
            analyticsUtils.setNextPageData({ pageName: name });
        },

        watchForErrors: () => {
            //Parse through the error object to get what we need in the format we need it in
            const getAnalyticsFields = (errors = {}) => {
                const formErrors = {
                    errorFields: [],
                    errorMessages: []
                };
                Object.keys(ERROR_LEVEL).forEach(errorLevel => {
                    Object.keys(errors[errorLevel]).forEach(errorKey => {
                        formErrors.errorFields.push(errorKey);
                        formErrors.errorMessages.push(errors[errorLevel][errorKey].message);
                    });
                });

                return formErrors;
            };

            const handleErrors = errors => {
                const analyticsFields = getAnalyticsFields(errors.errors);

                // Correctly set pageDetail based on most recent asyncPageLoad. If there are no
                // asyncPageLoad events, it will default to pageDetail of initial pageLoad event
                const mostRecentAsyncLoadEvent = analyticsUtils.getMostRecentEvent('asyncPageLoad');
                let pageDetail = '';
                let previousPageName = digitalData.page.attributes.previousPageData.pageName;

                if (mostRecentAsyncLoadEvent) {
                    pageDetail = mostRecentAsyncLoadEvent.eventInfo.attributes.pageDetail;
                    previousPageName = mostRecentAsyncLoadEvent.eventInfo.attributes.previousPageName;
                }

                // Promo errors are handled elsewhere and have different requirements than
                // general checkout errors
                const isPromoError = analyticsFields.errorFields.length && analyticsFields.errorFields[0] === 'basketLevelMsg';

                if ((analyticsFields.errorMessages.length || analyticsFields.errorFields.length) && !isPromoError) {
                    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                        data: {
                            bindingMethods: linkTrackingError,
                            errorMessages: analyticsFields.errorMessages,
                            fieldErrors: analyticsFields.errorFields,
                            eventStrings: [anaConsts.Event.EVENT_71],
                            linkName: anaConsts.EVENT_NAMES.ERROR,
                            previousPage: previousPageName,
                            usePreviousPageName: true,
                            pageDetail: pageDetail,
                            pageName: digitalData.page.attributes.sephoraPageInfo.pageName
                        }
                    });
                }
            };

            store.watchAction(ErrorsActions.TYPES.VALIDATE_ERRORS, handleErrors);
        }
    }; //End Methods

    return methods;
}());
