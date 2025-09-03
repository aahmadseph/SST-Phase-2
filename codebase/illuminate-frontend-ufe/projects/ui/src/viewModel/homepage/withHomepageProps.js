import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FORCE_PRIVACY_MODAL_QUERY } from 'constants/location';
import { homePage } from 'constants/seo';
import { homeItemsSelector } from 'selectors/page/home/homeItemsSelector';
import { homeSeoSelector } from 'selectors/page/home/homeSeoSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import FrameworkUtils from 'utils/framework';
import actions from 'actions/Actions';
import ConstructorRecsActions from 'actions/ConstructorRecsActions';
import Empty from 'constants/empty';
import homepageActions from 'actions/HomepageActions';
import HomePageBindings from 'analytics/bindingMethods/pages/home/HomePageBindings';
import languageLocaleUtils from 'utils/LanguageLocale';
import ContentConstants from 'constants/content';
import AccountActions from 'actions/AccountActions';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import { p13nSelector } from 'selectors/p13n/p13nSelector';
import { showHomepageUgcWidgetSelector } from 'viewModel/selectors/testTarget/showHomepageUgcWidgetSelector';

const { wrapHOC } = FrameworkUtils;
const { COMPONENT_TYPES } = ContentConstants;
const { updateRequestData } = ConstructorRecsActions;
const { displayCloseAccountSuccessfulModal } = AccountActions;
const { seoJSON } = homePage;

const WIDGET_IDS_PROD = {
    CANADA: '24576109',
    FRENCH: '24575841',
    DEFAULT: '24575887'
};

const WIDGET_IDS = {
    CANADA: '24983719',
    FRENCH: '24983733',
    DEFAULT: '24983722'
};

const getWidgetId = () => {
    const isProd = Sephora.UFE_ENV === 'PROD';

    if (languageLocaleUtils.isCanada()) {
        return isProd ? WIDGET_IDS_PROD.CANADA : WIDGET_IDS.CANADA;
    }

    if (languageLocaleUtils.isFrench()) {
        return isProd ? WIDGET_IDS_PROD.FRENCH : WIDGET_IDS.FRENCH;
    }

    return isProd ? WIDGET_IDS_PROD.DEFAULT : WIDGET_IDS.DEFAULT;
};

const widgetId = getWidgetId();

const fields = createSelector(
    coreUserDataSelector,
    testTargetOffersSelector,
    isTestTargetReadySelector,
    homeItemsSelector,
    homeSeoSelector,
    p13nSelector,
    showHomepageUgcWidgetSelector,
    (user, testTargetOffers, testTargetReady, initialItems, seoData, p13n, showHomepageUgcWidget) => {
        let items = Empty.Array;
        const { header1, schemas } = seoData;

        if (initialItems.length) {
            items = initialItems.map((item, index) => {
                // The Hero Banner List can be positioned dynamically at indices 0-2 in the Component List, depending on CMS configuration.
                // Guard clause to minimize unnecessary processing on subsequent Banner List components.
                if (item.type !== COMPONENT_TYPES.BANNER_LIST || index > 2) {
                    return item;
                }

                const modifiedItem = { ...item };

                // Custom margin for the hero Banner when it is the first item on the component list.
                if (index === 0) {
                    modifiedItem.marginTop = 2;
                }

                return modifiedItem;
            });

            if (showHomepageUgcWidget.challengerOne) {
                const featuredCategoriesIndex = items.findIndex(item => item.title === 'Need a Little Guidance?');

                if (featuredCategoriesIndex !== -1) {
                    items.splice(featuredCategoriesIndex, 0, {
                        type: COMPONENT_TYPES.UGC_WIDGET,
                        widgetId: widgetId
                    });
                }
            }

            if (showHomepageUgcWidget.challengerTwo) {
                items.push({
                    type: COMPONENT_TYPES.UGC_WIDGET,
                    widgetId: widgetId
                });
            }
        }

        const headerText = header1 || 'Sephora Homepage';
        let showCCPADialog = false;
        let userAccountClosed;

        if (!Sephora.isNodeRender) {
            showCCPADialog = global.window.location.search.indexOf(FORCE_PRIVACY_MODAL_QUERY) !== -1 && languageLocaleUtils.isUS();
            userAccountClosed = Storage.local.getItem(LOCAL_STORAGE.USER_ACCOUNT_CLOSED);
            Storage.local.removeItem(LOCAL_STORAGE.USER_ACCOUNT_CLOSED);
        }

        return {
            headerText,
            items,
            seoJSON,
            showCCPADialog,
            schemas,
            user,
            testTargetOffers,
            testTargetReady,
            userAccountClosed,
            p13n
        };
    }
);

const functions = {
    setP13NInitialization: homepageActions.setP13NInitialization,
    setPageLoadAnalytics: HomePageBindings.setPageLoadAnalytics,
    showConsumerPrivacyModal: actions.showConsumerPrivacyModal,
    showCloseAccountSuccessfulModal: displayCloseAccountSuccessfulModal,
    updateRequestData,
    setPersonalizationAnalyticsData: homepageActions.setPersonalizationAnalyticsData
};

const withHomepageProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withHomepageProps
};
