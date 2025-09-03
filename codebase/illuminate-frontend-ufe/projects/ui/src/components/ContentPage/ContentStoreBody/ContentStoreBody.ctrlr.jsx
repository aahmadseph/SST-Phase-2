import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import store from 'Store';
import anaConsts from 'analytics/constants';
import replaceSpecialCharacters from 'utils/replaceSpecialCharacters';
import Location from 'utils/Location';
import analyticsUtils from 'analytics/utils';
import userUtils from 'utils/User';
import Actions from 'Actions';

import { site } from 'style/config';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import ComponentList from 'components/Content/ComponentList';
import DropdownMW from 'components/ContentPage/DropdownMW/DropdownMW';
import bccUtils from 'utils/BCC';
import PleaseSignInBlock from 'components/RichProfile/MyAccount/PleaseSignIn';
import ContentStoreSOTBindings from 'analytics/bindingMethods/pages/contentStore/contentStoreSOTBindings';

const { COMPONENT_NAMES } = bccUtils;

const privatePages = [];

class ContentStoreBody extends BaseClass {
    state = {
        showBCCComponent: false,
        showContentfulComponent: false,
        showMobileDropdown: false,
        isAllowedToDisplayTheContent: true
    };

    componentDidMount() {
        if (Location.isAtRiskPage() && Location.isPickupDeliveryOptionsPage()) {
            this.setState({ showContentfulComponent: true });
        } else {
            this.setState({ showBCCComponent: true });
        }

        this.setAnalytics();

        store.setAndWatch('user', this, (data = {}) => {
            if (!this.isThisTargetUrlPrivate()) {
                return;
            }

            this.setState({ isAllowedToDisplayTheContent: !userUtils.isAnonymous() }, () => {
                if (data.user.isInitialized && userUtils.isAnonymous()) {
                    this.showSignInModal();
                }
            });
        });
    }

    componentDidUpdate() {
        if (Location.isAtRiskPage() && !this.state.showContentfulComponent) {
            this.setState({ showContentfulComponent: true });
        }
    }

    setAnalytics = () => {
        const { breadcrumbs = [], ancestorHierarchy, isNoNav = false, analtyicsTitle = '' } = this.props;

        const previousPageData = analyticsUtils.getPreviousPageData();
        const isFinderPage = () => {
            const myRegex = new RegExp(`${anaConsts.PAGE_NAMES.SHADE_FINDER_MATCH_FOUND}`);
            const isFinderResults = previousPageData?.pageName === anaConsts.PAGE_NAMES.SHADE_FINDER_RESULTS;
            const isFinderMatchFound = (previousPageData?.pageName || '').match(myRegex);

            return isFinderResults || isFinderMatchFound;
        };

        if (isFinderPage()) {
            digitalData.page.category.pageType = 'product';
            digitalData.page.pageInfo.pageName = previousPageData.previousPageName;
            digitalData.page.attributes.world = previousPageData.world;
        } else if (Location.isChallengeFAQPage()) {
            digitalData.page.category.pageType = anaConsts.PAGE_TYPES.GAMIFICATION;
            digitalData.page.pageInfo.pageName = anaConsts.PAGE_NAMES.FAQ;
            digitalData.page.attributes.world = '';
        } else if (Location.isChallengeTermsPage()) {
            digitalData.page.category.pageType = anaConsts.PAGE_TYPES.GAMIFICATION;
            digitalData.page.pageInfo.pageName = anaConsts.PAGE_NAMES.TERMS_AND_CONDITIONS;
            digitalData.page.attributes.world = '';
        } else if (Location.isColorIQSpokeEntryPoint()) {
            ContentStoreSOTBindings.shadeFinderResults();
        } else if (isNoNav) {
            digitalData.page.category.pageType = anaConsts.PAGE_TYPES.CONTENT_STORE;
            digitalData.page.pageInfo.pageName = analtyicsTitle.toLowerCase();
        } else {
            const firstCrumb = breadcrumbs[0] || {};
            const lastCrumb = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 1] : {};
            const ancestorName = ancestorHierarchy && ancestorHierarchy[0]?.displayName;
            const topLevelName = firstCrumb.name || ancestorName || '';
            const childName = lastCrumb && lastCrumb.name ? `-${lastCrumb.name}` : '';
            const isBuyingGuideChild = Boolean(topLevelName === 'Quizzes & Buying Guides' && childName);

            digitalData.page.category.pageType = anaConsts.PAGE_TYPES.CONTENT_STORE;
            digitalData.page.pageInfo.pageName = replaceSpecialCharacters(`${topLevelName}${childName}`.toLowerCase());
            digitalData.page.attributes.world = isBuyingGuideChild ? breadcrumbs[1]?.name : '';

            if (previousPageData?.pageType === anaConsts.PAGE_TYPES.OLR) {
                // set prop55 to H@S gift a service
                if (!digitalData.page.attributes.previousPageData) {
                    digitalData.page.attributes.previousPageData = {
                        prop55: 'H@S gift a service'
                    };
                } else {
                    digitalData.page.attributes.previousPageData.prop55 = 'H@S gift a service';
                }
            }
        }
    };

    showSignInModal = () => {
        store.dispatch(Actions.showSignInModal({ isOpen: true }));
    };

    isThisTargetUrlPrivate = () => {
        const { targetUrl } = this.props;

        if (!targetUrl) {
            return false;
        }

        return privatePages.includes(targetUrl);
    };

    getPropsCallback = componentType => {
        let result = null;
        const isComponentCarouselOrSkuGrid = [COMPONENT_NAMES.CAROUSEL, COMPONENT_NAMES.SKU_GRID].includes(componentType);

        if (!this.props.isContained && isComponentCarouselOrSkuGrid) {
            result = {
                firstParentCategoryId: this.props.ancestorHierarchy[0]?.targetScreen?.targetValue,
                contextStyle: { marginLeft: site.MAIN_INDENT }
            };
        }

        return result;
    };

    render() {
        const { items, isContained = true, ancestorHierarchy } = this.props;

        if (!this.state.isAllowedToDisplayTheContent) {
            return <PleaseSignInBlock />;
        }

        let mobileDropdown = null;

        if (Sephora.isMobile() && ancestorHierarchy && this.state.showMobileDropdown) {
            mobileDropdown = (
                <DropdownMW
                    navItems={ancestorHierarchy}
                    title={ancestorHierarchy[0].displayName}
                />
            );
        }

        return this.state.showContentfulComponent ? (
            <div>
                {mobileDropdown}
                {items && (
                    <ComponentList
                        isContained={isContained}
                        analyticsContext={anaConsts.CONTEXT.CONTENT_STORE}
                        items={items}
                        disableLazyLoadCount={items.length > 1 ? 2 : 1}
                        enablePageRenderTracking={true}
                        propsCallback={this.getPropsCallback}
                    />
                )}
            </div>
        ) : this.state.showBCCComponent ? (
            <div>
                {mobileDropdown}
                {items && (
                    <BccComponentList
                        isContained={isContained}
                        analyticsContext={anaConsts.CONTEXT.CONTENT_STORE}
                        items={items}
                        disableLazyLoadCount={items.length > 1 ? 2 : 1}
                        enablePageRenderTracking={true}
                        propsCallback={this.getPropsCallback}
                    />
                )}
            </div>
        ) : null;
    }
}

export default wrapComponent(ContentStoreBody, 'ContentStoreBody', true);
