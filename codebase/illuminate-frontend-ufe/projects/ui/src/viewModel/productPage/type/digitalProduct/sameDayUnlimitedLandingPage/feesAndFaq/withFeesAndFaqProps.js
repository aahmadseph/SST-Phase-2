import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import Actions from 'Actions';
import FrameworkUtils from 'utils/framework';
import urlUtils from 'utils/Url';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import SameDayUnlimitedBindings from 'analytics/bindingMethods/pages/myAccount/SameDayUnlimitedBindings';
const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/ProductPage/Type/DigitalProduct/SameDayUnlimitedLandingPage/FeesAndFAQ/locales', 'FeesAndFAQ');

const fields = createSelector(
    createStructuredSelector({
        taxes: getTextFromResource(getText, 'plusApplicableTaxes'),
        fees: getTextFromResource(getText, 'feesMayApply'),
        needHelp: getTextFromResource(getText, 'needHelp'),
        viewFaq: getTextFromResource(getText, 'viewFaqs')
    }),
    textResources => {
        const redirectToFAQ = () => urlUtils.redirectTo('/beauty/same-day-unlimited-faq');
        const fireAnalytics = openInModal => {
            const pageType = openInModal ? anaConsts.PAGE_TYPES.SAME_DAY_UNLIMITED : anaConsts.PAGE_TYPES.CONTENT_STORE;
            const pageDetail = openInModal ? anaConsts.PAGE_DETAIL.SAME_DAY_UNLIMITED_FAQ_MODAL : anaConsts.PAGE_DETAIL.SAME_DAY_UNLIMITED_FAQ_PAGE;
            const data = {
                pageName: `${pageType}:${pageDetail}:n/a:*`,
                pageType,
                pageDetail
            };

            if (openInModal) {
                processEvent.process(anaConsts.LINK_TRACKING_EVENT, { data });
            } else {
                anaUtils.setNextPageData(data);
            }
        };
        const FAQClick = () => {
            SameDayUnlimitedBindings.FAQClick();
        };

        return {
            ...textResources,
            redirectToFAQ,
            FAQClick,
            fireAnalytics
        };
    }
);

const functions = {
    showMediaModal: Actions.showMediaModal
};

const withFeesAndFaqProps = wrapHOC(connect(fields, functions));

export {
    withFeesAndFaqProps, fields
};
