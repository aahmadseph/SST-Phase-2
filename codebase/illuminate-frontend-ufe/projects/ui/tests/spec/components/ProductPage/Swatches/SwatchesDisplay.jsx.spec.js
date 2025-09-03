/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');
const skuUtils = require('utils/Sku').default;

describe('<SwatchesDisplay />', () => {
    let ReactDOM;
    let wrapper;
    let component;
    let store;
    let SwatchesDisplay;
    let swatchUtils;
    let props;

    beforeEach(() => {
        ReactDOM = require('react-dom');
        store = require('store/Store').default;
        SwatchesDisplay = require('components/ProductPage/Swatches/SwatchesDisplay').default;
        swatchUtils = require('utils/Swatch').default;
        props = {
            product: {
                currentSku: {
                    skuId: '1925122',
                    size: '12oz'
                }
            },
            currentProduct: {
                isReverseLookupEnabled: true,
                productDetails: { productId: 'P124' }
            },
            showColorMatch: false,
            swatchGroups: [[{ skuId: '1925122' }, { skuId: '1925122' }]],
            swatchFilters: ['Matte finish']
        };
        wrapper = shallow(<SwatchesDisplay {...props} />);
        component = wrapper.instance();
    });

    describe('size', () => {
        it('should render data-at attribute ', () => {
            const dataAt = wrapper.findWhere(n => n.prop('data-at') === 'sku_size_label');
            expect(dataAt.length).toEqual(1);
        });
    });

    describe('resetScrollPosition', () => {
        it('should not set needToScroll and not call forceUpdate if sku changed by user Click On SwatchItem', () => {
            // Arrange
            component.userClickedOnSwatchItem = true;
            component.needToScroll = false;
            const forceUpdateSpy = spyOn(component, 'forceUpdate');

            // Act
            component.resetScrollPosition();

            // Assert
            expect(component.needToScroll).toBe(false);
            expect(forceUpdateSpy).toHaveBeenCalledTimes(0);
        });

        it('should set needToScroll and call forceUpdate if sku changed not by user Click On SwatchItem', () => {
            // Arrange
            component.userClickedOnSwatchItem = false;
            component.needToScroll = false;
            const forceUpdateSpy = spyOn(component, 'forceUpdate');

            // Act
            component.resetScrollPosition();

            // Assert
            expect(component.needToScroll).toBe(true);
            expect(forceUpdateSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('showShadeFinder', () => {
        let analyticsConsts;
        let processEvent;
        let processSpy;

        beforeEach(() => {
            analyticsConsts = require('analytics/constants').default;
            processEvent = require('analytics/processEvent').default;
            processSpy = spyOn(processEvent, 'process');
        });

        it('should execute analytics processEvent.process with correct args when there is world', () => {
            window.digitalData.page.attributes.world = 'makeup';
            component.showShadeFinder(props.currentProduct);
            expect(processSpy).toHaveBeenCalledWith(analyticsConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: 'product:shade finder-landing page:makeup:*',
                    pageType: 'product',
                    pageDetail: 'shade finder-landing page',
                    internalCampaign: 'product:shade finder:p124',
                    world: 'makeup'
                }
            });
        });

        it('should execute analytics processEvent.process with correct args when there is no world', () => {
            window.digitalData.page.attributes.world = undefined;
            component.showShadeFinder(props.currentProduct);
            expect(processSpy).toHaveBeenCalledWith(analyticsConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: 'product:shade finder-landing page:n/a:*',
                    pageType: 'product',
                    pageDetail: 'shade finder-landing page',
                    internalCampaign: 'product:shade finder:p124',
                    world: undefined
                }
            });
        });
    });

    describe('handleSwatchTypeSelector', () => {
        let analyticsConsts;
        let processEvent;
        let processSpy;
        let e;

        beforeEach(() => {
            e = { preventDefault: jasmine.createSpy() };
            analyticsConsts = require('analytics/constants').default;
            processEvent = require('analytics/processEvent').default;
            processSpy = spyOn(processEvent, 'process');
        });

        it('should execute analytics processEvent.process with correct args when List is selected', () => {
            component.handleSwatchTypeSelector(e, 'List');
            expect(processSpy).toHaveBeenCalledWith(analyticsConsts.LINK_TRACKING_EVENT, {
                data: {
                    actionInfo: 'product:swatch:list',
                    linkName: 'product:swatch:list',
                    eventStrings: [analyticsConsts.Event.EVENT_71]
                }
            });
        });

        it('should execute analytics processEvent.process with correct args when Grid is selected', () => {
            component.handleSwatchTypeSelector(e, 'Grid');
            expect(processSpy).toHaveBeenCalledWith(analyticsConsts.LINK_TRACKING_EVENT, {
                data: {
                    actionInfo: 'product:swatch:grid',
                    linkName: 'product:swatch:grid',
                    eventStrings: [analyticsConsts.Event.EVENT_71]
                }
            });
        });
    });

    describe('colorSwatchDisplay a/b test', () => {
        const state = { colorSwatchDisplayExperience: 'current' };

        it('should render hybrid grid/dropdown option if Target response is show hybrid', () => {
            props.product.skuSelectorType = 'Image';
            wrapper = shallow(<SwatchesDisplay {...props} />, { disableLifecycleMethods: true });
            wrapper.setState(state);

            const instance = wrapper.instance();

            spyOn(instance, 'showSmallView').and.returnValue(true);
            spyOn(skuUtils, 'isFragrance').and.returnValue(false);
            wrapper.setState({ colorSwatchDisplayExperience: 'showHybrid' });

            instance.handleResize();

            expect(instance.state.showDropdown).toBeTruthy();
        });
    });
});
