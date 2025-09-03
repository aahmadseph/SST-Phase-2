/* eslint-disable no-unused-vars */
const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('ProductItem component', () => {
    let props;
    let wrapper;
    let component;
    let ProductItem;
    let showSimilarProductsModalStub;
    let anaUtils;
    let anaConsts;
    let processEvent;
    let snbApi;
    let locationUtils;
    let quicklookModalUtils;
    let dispatchQuicklookSpy;

    beforeEach(() => {
        ProductItem = require('components/Product/ProductItem/ProductItem').default;
        anaUtils = require('analytics/utils').default;
        anaConsts = require('analytics/constants').default;
        processEvent = require('analytics/processEvent').default;
        snbApi = require('services/api/search-n-browse').default;
        locationUtils = require('utils/Location').default;
        quicklookModalUtils = require('utils/Quicklook').default;

        Sephora.isTouch = false;
        props = {
            imageSize: 162,
            key: 'P12312',
            productId: 'P12312',
            skuImages: {},
            brandName: 'my brand name',
            productName: 'my product name',
            rootContainerName: 'root container name',
            sku: { skuId: '12345' },
            skuId: '12345',
            analyticsContext: 'anaContext',
            badgeAltText: 'my badge',
            product: { productStringContainerName: 'string' },
            showSimilarProductsModal: () => {},
            targetUrl: 'https://local.sephora.com/product/rare-beauty-by-selena-gomez-soft-pinch-liquid-blush-P97989778'
        };
        showSimilarProductsModalStub = spyOn(props, 'showSimilarProductsModal');
        wrapper = shallow(<ProductItem {...props} />);
        component = wrapper.instance();
    });

    describe('mouse events', () => {
        it('should setState hover to true on mouseEnter', () => {
            component.hoverOn();
            expect(component.state.hover).toBeTruthy();
        });

        it('should setState hover to false on mouseLeave', () => {
            component.hoverOff();
            expect(component.state.hover).toBeFalsy();
        });
    });

    describe('handleViewSimilarProductsClick', () => {
        let processStub;
        let previousDigitalDataPageName;
        beforeEach(() => {
            previousDigitalDataPageName = digitalData.page.pageInfo.pageName;
            digitalData.page.pageInfo.pageName = 'page name';
            processStub = spyOn(processEvent, 'process');
            spyOn(anaUtils, 'getLastAsyncPageLoadData').and.returnValue({ pageName: 'anaPageName' });
            component.handleViewSimilarProductsClick({ preventDefault: createSpy('preventDefault') });
        });

        it('should call to showSimilarProductsModal action', () => {
            expect(showSimilarProductsModalStub).toHaveBeenCalledWith({
                isOpen: true,
                brandName: 'my brand name',
                productName: 'my product name',
                productImages: {},
                itemId: 'P12312',
                analyticsContext: 'anaContext',
                badgeAltText: 'my badge',
                skuId: '12345'
            });
        });

        it('should call process for async load', () => {
            expect(processStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: 'view similar:p12312:n/a:*pname=my product name',
                    pageType: anaConsts.PAGE_TYPES.VIEW_SIMILAR,
                    previousPageName: 'anaPageName',
                    internalCampaign: 'root container name:P12312:view similar products',
                    pageDetail: 'page name'
                }
            });
        });

        afterEach(() => {
            digitalData.page.pageInfo.pageName = previousDigitalDataPageName;
        });
    });

    /*eslint camelcase: ["error", {properties: "never"}]*/
    describe('onClick', () => {
        let setNextPageDataStub;
        let getLastAsyncPageLoadDataStub;
        let navigateToSpy;

        beforeEach(() => {
            setNextPageDataStub = spyOn(anaUtils, 'setNextPageData');
            getLastAsyncPageLoadDataStub = spyOn(anaUtils, 'getLastAsyncPageLoadData');
            navigateToSpy = spyOn(locationUtils, 'navigateTo');
        });

        it('should remove apostrophe from container name to make analytics consistent', () => {
            // Arrange
            wrapper.setProps({
                rootContainerName: 'Editors\' Picks'
            });
            getLastAsyncPageLoadDataStub.and.returnValue({
                pageName: 'anaPageName',
                pageType: 'anaPageType'
            });

            // Act
            component.onClick();

            // Assert
            expect(setNextPageDataStub).toHaveBeenCalledWith({
                pageName: 'anaPageName',
                pageType: 'anaPageType',
                recInfo: {
                    isExternalRec: 'sephora',
                    componentTitle: 'Editors Picks'
                },
                internalCampaign: null // eVar75
            });
        });

        it('should not include pageName when calling setNextPageData if its undefined in recent event', () => {
            // Arrange
            wrapper.setProps({
                rootContainerName: 'Editors\' Picks'
            });
            getLastAsyncPageLoadDataStub.and.returnValue({});

            // Act
            component.onClick();

            // Assert
            expect(setNextPageDataStub).toHaveBeenCalledWith({
                recInfo: {
                    isExternalRec: 'sephora',
                    componentTitle: 'Editors Picks'
                },
                internalCampaign: null // eVar75
            });
        });

        it('should get analytics page data using the context', () => {
            // Arrange
            getLastAsyncPageLoadDataStub.and.returnValue({ pageName: 'anaPageName' });

            // Act
            component.onClick();

            // Assert
            expect(getLastAsyncPageLoadDataStub).toHaveBeenCalledWith({ pageType: 'anaContext' });
        });

        describe('for mobile', () => {
            let event;
            let getProductDetailsSpy;

            beforeEach(() => {
                spyOn(window.Sephora, 'isMobile').and.returnValue(true);
                spyOn(locationUtils, 'isNthCategoryPage').and.returnValue(true);
                wrapper.setProps({ toggleMwebQuickLookIsHidden: false });

                getProductDetailsSpy = spyOn(snbApi, 'getProductDetails').and.returnValue(
                    Promise.resolve({
                        productId: 'P01',
                        displayName: 'Test Product',
                        currentSku: {
                            skuId: 'S01',
                            skuImages: { image250: '/productimages/sku/s1960004-main-hero.jpg' },
                            type: 'standard'
                        },
                        productStringContainerName: 'Product Container Name',
                        shortDescription: 'this is a description'
                    })
                );

                dispatchQuicklookSpy = spyOn(quicklookModalUtils, 'dispatchQuicklook');

                event = { preventDefault: createSpy('preventDefault') };
            });

            it('should call preventDefault', () => {
                component.onClick(event);
                expect(event.preventDefault).toHaveBeenCalled();
            });

            it('should call dispatchQuicklook', () => {
                component.onClick(event);
                expect(dispatchQuicklookSpy).toHaveBeenCalled();
            });
        });
    });
});
