import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import getBreadcrumbs from 'components/CreatorStoreFront/helpers/getBreadCrumbs';
import ProfileDisplay from 'components/CreatorStoreFront/ProfileDisplay';
import ProfileDisplayMiniHeader from 'components/CreatorStoreFront/ProfileDisplayMiniHeader';
import SimpleChicletNav from 'components/CreatorStoreFront/SimpleChicletNav';
import Breadcrumb from 'components/Content/Breadcrumb';
import { csfRouteComponents, csfDynamicRoutes } from 'components/CreatorStoreFront/views/CSFViews';
import { getCsfRoute } from 'components/CreatorStoreFront/helpers/getCsfRoute';
import getPageTypeFromPath from 'components/CreatorStoreFront/helpers/getPageTypeFromPath';
import { navigateTo } from 'components/CreatorStoreFront/helpers/csfNavigation';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';
import { Container } from 'components/ui';
import ConstructorCarousel from 'components/ConstructorCarousel';
import { CONSTRUCTOR_PODS, GROUPING } from 'constants/constructorConstants';
import CSFBackToTopButton from 'components/CreatorStoreFront/CSFBackToTopButton';
import { initializeInstagramEmbeds } from 'components/CreatorStoreFront/helpers/socialMediaEmbed';
import Empty from 'constants/empty';
import { captureAttributionData, updateAttributionNavigation } from 'components/CreatorStoreFront/helpers/csfAttribution';

class CreatorStoreFront extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            currentComponent: null,
            componentProps: Empty.Object,
            handle: '',
            isReady: false,
            section: ''
        };
    }

    async componentDidMount() {
        const { dispatch, initializeCSFCreatorProfileData } = this.props;
        const route = getCsfRoute(window.location.pathname);
        const { handle, identifier } = route;
        const section = route.section || CSF_PAGE_TYPES.FEATURED;

        this.setState({ handle, section });

        try {
            await initializeCSFCreatorProfileData(handle);

            // Capture attribution data once on initial load with identifier
            this.captureCSFAttributionData(section, identifier);

            const { contentSummary } = this.props.creatorProfileData?.creatorProfile || Empty.Object;

            // Redirect to FEATURED if collections/posts not available and user hits one of those routes
            const isInvalidSection = [CSF_PAGE_TYPES.COLLECTIONS, CSF_PAGE_TYPES.POSTS].includes(section);
            const isMissingContent =
                (section === CSF_PAGE_TYPES.COLLECTIONS && contentSummary?.collectionsCount === 0) ||
                (section === CSF_PAGE_TYPES.POSTS && contentSummary?.postsCount === 0);

            if (isInvalidSection && isMissingContent) {
                await navigateTo(`/creators/${handle}`, dispatch, true, false);
                this.renderDefaultRoute(handle);
                this.setState({ isReady: true });

                return;
            }

            await this.fetchPageDataForPath(window.location.pathname);
            this.renderRouteFromPath(window.location.pathname);
            this.setState({ isReady: true });

            window.addEventListener('popstate', this.handleRouting);
            window.addEventListener('csfNavigationComplete', this.handleNavigationComplete);
        } catch (error) {
            Sephora.logger.error('Error initializing CreatorStoreFront:', error);

            const { contentSummary } = this.props.creatorProfileData?.creatorProfile || Empty.Object;

            const isValidSection = [CSF_PAGE_TYPES.COLLECTIONS, CSF_PAGE_TYPES.POSTS].includes(section);
            const hasContent =
                (section === CSF_PAGE_TYPES.COLLECTIONS && contentSummary?.collectionsCount > 0) ||
                (section === CSF_PAGE_TYPES.POSTS && contentSummary?.postsCount > 0);

            if (isValidSection && hasContent) {
                await navigateTo(`/creators/${handle}/${section}`, dispatch, true, false);
                this.renderRouteFromPath(window.location.pathname);
                this.setState({ isReady: true });

                return;
            }
        }

        // Initialize Instagram embed early to avoid race conditions in post detail component.
        initializeInstagramEmbeds();
    }

    componentDidUpdate(prevProps, prevState) {
        const { creatorStoreFrontData, pageData } = this.props;
        const { pageType: currentPageType } = creatorStoreFrontData || Empty.Object;
        const { pageType: prevPageType } = prevProps.creatorStoreFrontData || Empty.Object;

        const pageTypeChanged = currentPageType !== prevPageType;
        const pageDataChanged = pageData !== prevProps.pageData;

        const route = getCsfRoute(window.location.pathname);
        const section = route.section || CSF_PAGE_TYPES.FEATURED;

        if (section?.length && prevState?.section !== section) {
            this.setState({ section });
        }

        if (pageTypeChanged || pageDataChanged) {
            this.renderRouteFromPath(window.location.pathname);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.handleRouting);
        window.removeEventListener('csfNavigationComplete', this.handleNavigationComplete);
    }

    fetchPageDataForPath = async path => {
        const pageType = getPageTypeFromPath(path) || CSF_PAGE_TYPES.FEATURED;
        await this.props.initializeCSFPageData?.(pageType, path);
    };

    handleRouting = async () => {
        const path = window.location.pathname;

        try {
            await this.fetchPageDataForPath(path);
        } catch (err) {
            Sephora.logger.error('Error fetching page data on route change:', err);
        }

        this.renderRouteFromPath(path);
    };

    handleNavigationComplete = event => {
        const path = event.detail.path;
        const { handle, section, identifier } = getCsfRoute(path);

        // Update attribution on navigation (preserves existing U1)
        updateAttributionNavigation(handle, section, identifier);

        this.renderRouteFromPath(path);
    };

    captureCSFAttributionData = (section, identifier) => {
        captureAttributionData({
            section,
            identifier,
            creatorProfile: this.props.creatorProfileData?.creatorProfile
        });
    };

    renderRouteFromPath(path) {
        const { handle, section, identifier } = getCsfRoute(path);
        const pageType = getPageTypeFromPath(path) || CSF_PAGE_TYPES.FEATURED;

        if (this.isDynamicRoute(section, identifier)) {
            this.renderDynamicRoute(section, identifier, handle, pageType);
        } else if (this.isStaticRoute(section)) {
            this.renderStaticRoute(section, handle, pageType);
        } else {
            this.renderDefaultRoute(handle);
        }
    }

    isDynamicRoute = (section, identifier) => {
        return identifier && Object.keys(csfDynamicRoutes).some(key => key.startsWith(`${section}/:`));
    };

    isStaticRoute = section => Object.prototype.hasOwnProperty.call(csfRouteComponents, section);

    renderDynamicRoute = (section, identifier, handle, pageType) => {
        const dynamicRouteKey = Object.keys(csfDynamicRoutes).find(key => key.startsWith(`${section}/:`));
        const Component = csfDynamicRoutes[dynamicRouteKey];
        const dynamicParam = dynamicRouteKey ? dynamicRouteKey.split('/:')[1] : null;

        if (!Component || !dynamicParam) {
            Sephora.logger.error(`No dynamic component found for route: ${section}/${identifier}`);
            this.renderDefaultRoute(handle);

            return;
        }

        const componentProps = {
            [dynamicParam]: identifier,
            handle,
            section,
            pageType
        };

        this.setState({ currentComponent: Component, componentProps });

        return;
    };

    renderStaticRoute = (section, handle, pageType) => {
        const Component = csfRouteComponents[section];
        const componentProps = { handle, section, pageType };
        this.setState({ currentComponent: Component, componentProps });
    };

    renderDefaultRoute = handle => {
        const Component = csfRouteComponents[CSF_PAGE_TYPES.FEATURED];
        this.setState({
            currentComponent: Component,
            componentProps: {
                handle,
                section: CSF_PAGE_TYPES.FEATURED,
                pageType: CSF_PAGE_TYPES.FEATURED
            }
        });
    };

    isMainRoute = () => {
        if (typeof window === 'undefined') {
            return false;
        }

        const { section, identifier } = getCsfRoute(window.location.pathname);
        const mainSections = new Set([CSF_PAGE_TYPES.FEATURED, CSF_PAGE_TYPES.POSTS, CSF_PAGE_TYPES.PRODUCTS, CSF_PAGE_TYPES.COLLECTIONS, '']);

        return mainSections.has(section) && !identifier;
    };

    handleBreadcrumbClick = (e, link) => {
        if (link?.href) {
            e.preventDefault();
            navigateTo(link.href, this.props.dispatch, true);
        }
    };

    renderContentForRoute = () => {
        const { currentComponent: Component, componentProps, isReady } = this.state;
        const { pageData, ...restProps } = this.props;

        if (!isReady || !Component) {
            return null;
        }

        const isMainRoute = this.isMainRoute();

        return (
            <>
                <CSFBackToTopButton isMainRoute={isMainRoute} />
                <Component
                    {...restProps}
                    {...pageData}
                    {...componentProps}
                />
                <Container>
                    <ConstructorCarousel
                        marginTop={[5, null, 6]}
                        marginBottom={[4, null, 6]}
                        titleMarginBottom={[4, null, 5]}
                        podId={CONSTRUCTOR_PODS.CREATOR_STOREFRONT}
                        grouping={GROUPING.CREATOR_STOREFRONT}
                    />
                </Container>
            </>
        );
    };

    render() {
        const {
            dispatch, textResources, formattedMenuItems, pageData, creatorProfileData
        } = this.props;
        const { handle, section } = this.state;
        const isMainRoute = this.isMainRoute();
        const breadcrumbs = getBreadcrumbs({ pageData, creatorProfileData, localization: textResources });

        return (
            <div
                css={{ overflowX: 'hidden', width: '100%' }}
                id='csf_page_wrapper'
            >
                <div>
                    {isMainRoute && (
                        <>
                            {creatorProfileData && <ProfileDisplay pathName={section} />}
                            <SimpleChicletNav
                                dispatch={dispatch}
                                handle={handle}
                                menuItems={formattedMenuItems}
                            />
                        </>
                    )}
                </div>
                <div>
                    {!isMainRoute && breadcrumbs?.length > 0 && creatorProfileData && (
                        <>
                            <Container>
                                <Breadcrumb
                                    breadcrumbs={breadcrumbs}
                                    fontSize='sm'
                                    onLinkClick={this.handleBreadcrumbClick}
                                />
                                <ProfileDisplayMiniHeader
                                    dispatch={dispatch}
                                    handle={handle}
                                />
                            </Container>
                        </>
                    )}

                    {this.renderContentForRoute()}
                </div>
            </div>
        );
    }
}

CreatorStoreFront.propTypes = {
    textResources: PropTypes.object,
    formattedMenuItems: PropTypes.array,
    pageData: PropTypes.object,
    creatorProfileData: PropTypes.object,
    creatorStoreFrontData: PropTypes.object,
    initializeCSFPageData: PropTypes.func,
    initializeCSFCreatorProfileData: PropTypes.func,
    dispatch: PropTypes.func
};

export default wrapComponent(CreatorStoreFront, 'CreatorStoreFront', true);
