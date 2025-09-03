import productPageBindings from 'analytics/bindingMethods/pages/productPage/productPageBindings';
import processEvent from 'analytics/processEvent';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';

function getSubmitQuestionAnalyticsData(product) {
    return {
        pageType: 'questions&answers',
        world: productPageBindings.getProductWorld(product) || 'n/a',
        productStrings: anaUtils.buildSingleProductString({ sku: product.currentSku })
    };
}

function fireSubmitPageLoad(product, isQuestion) {
    const { pageType, world, productStrings } = getSubmitQuestionAnalyticsData(product);

    const pageDetail = isQuestion ? 'question-ask' : 'answer-intent';

    digitalData.page.category.pageType = pageType;
    digitalData.page.attributes.world = world;
    digitalData.page.pageInfo.pageName = pageDetail;
    digitalData.page.attributes.productStrings = productStrings;
    Sephora.analytics.resolvePromises.productDataReady();
}

function fireSubmitSuccessPageLoad(product, isQuestion) {
    const { pageType, world, productStrings } = getSubmitQuestionAnalyticsData(product);
    const pageDetail = isQuestion ? 'question-submit' : 'answer-submit';
    const actionInfo = isQuestion ? 'submit a question' : 'submit this answer';

    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            pageName: [pageType, pageDetail, world, '*'].join(':'),
            actionInfo,
            productStrings
        }
    });
}

function fireSubmitLinkTrackingError(validationErrors) {
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            bindingMethods: linkTrackingError,
            fieldErrors: ['questions&answers'],
            validationErrorMessages: validationErrors,
            ...anaUtils.getLastAsyncPageLoadData()
        }
    });
}

export default {
    fireSubmitPageLoad,
    fireSubmitSuccessPageLoad,
    fireSubmitLinkTrackingError
};
