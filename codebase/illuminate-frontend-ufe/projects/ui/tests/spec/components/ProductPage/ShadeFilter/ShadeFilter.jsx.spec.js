const React = require('react');
const { shallow } = require('enzyme');
const { any, createSpy } = jasmine;

describe('<ShadeFilter />', () => {
    let ShadeFilter;
    let wrapper;
    let component;
    let selectedFilters;
    let setStateSpy;
    let currentProduct;
    let applyFiltersSpy;
    let applyGalleryFiltersCallbackSpy;

    beforeEach(() => {
        ShadeFilter = require('components/ProductPage/ShadeFilter/ShadeFilter').default;
        currentProduct = {};
        applyFiltersSpy = createSpy();
        wrapper = shallow(
            <ShadeFilter
                currentProduct={currentProduct}
                applyFilters={applyFiltersSpy}
            />
        );
        component = wrapper.instance();
        selectedFilters = [
            {
                skuId: '1234567',
                desc: 'desc'
            },
            {
                skuId: '1234568',
                desc: 'desc'
            }
        ];
    });

    describe('updateFilters method', () => {
        it('should call setState with the correct params', () => {
            setStateSpy = spyOn(component, 'setState');
            component.updateFilters(selectedFilters, true);

            expect(setStateSpy).toHaveBeenCalledWith({ selectedFilters }, any(Function));
        });

        it('should call applyGalleryFiltersCallback if shouldTriggerCallBack param is true', () => {
            applyGalleryFiltersCallbackSpy = spyOn(component, 'applyGalleryFiltersCallback');
            setStateSpy = spyOn(component, 'setState').and.callFake((_newState, callback) => callback());
            component.updateFilters(selectedFilters, true);

            expect(applyGalleryFiltersCallbackSpy).toHaveBeenCalled();
        });
    });

    describe('toggleDropdownOpen method', () => {
        it('should call setState with the correct params', () => {
            setStateSpy = spyOn(component, 'setState');
            const e = {};
            const isOpen = true;

            component.toggleDropdownOpen(e, isOpen);

            expect(setStateSpy).toHaveBeenCalledWith({
                isDropdownOpen: isOpen,
                selectedFilters: component.state.appliedFilters
            });
        });
    });

    describe('applyGalleryFiltersCallback method', () => {
        it('should call applyFilters with the correct params', () => {
            const newState = {
                appliedFilters: [
                    {
                        skuId: '1234567',
                        desc: 'desc'
                    }
                ]
            };

            component.applyGalleryFiltersCallback(newState);

            expect(applyFiltersSpy).toHaveBeenCalledWith({ skuId: newState.appliedFilters.map(filter => filter.skuId) });
        });
    });

    describe('applyGalleryFilters method', () => {
        let isReset;

        beforeEach(() => {
            isReset = false;
            component.state = {
                isDropdownOpen: false,
                selectedFilters: [
                    {
                        skuId: '1234567',
                        desc: 'desc'
                    }
                ]
            };
            setStateSpy = spyOn(component, 'setState');
            component.dropdownRef = { current: { triggerDropdown: createSpy() } };
        });

        it('should call setState with the correct params', () => {
            component.applyGalleryFilters(isReset);

            expect(setStateSpy).toHaveBeenCalledWith(
                {
                    isModalOpened: false,
                    selectedFilters: isReset ? [] : component.state.selectedFilters,
                    appliedFilters: isReset ? [] : component.state.selectedFilters,
                    isDropdownOpen: !component.state.isDropdownOpen
                },
                any(Function)
            );
        });

        it('should call applyGalleryFiltersCallback', () => {
            applyGalleryFiltersCallbackSpy = spyOn(component, 'applyGalleryFiltersCallback');
            setStateSpy.and.callFake((newState, callback) => {
                callback();
            });

            component.applyGalleryFilters(isReset);

            expect(applyGalleryFiltersCallbackSpy).toHaveBeenCalled();
        });
    });

    describe('rendering', () => {
        it('should render a FilterGroup component when product.variationType is Color & sku length is greater than 0', () => {
            currentProduct.variationType = 'Color';
            currentProduct.regularChildSkus = [{ skuId: '1234567' }, { skuId: '1234568' }];
            wrapper = shallow(
                <ShadeFilter
                    currentProduct={currentProduct}
                    applyFilters={applyFiltersSpy}
                />
            );

            expect(wrapper.find('FilterGroup').length).toEqual(1);
        });

        it('should not render a FilterGroup component when product.variationType is not Color', () => {
            currentProduct.variationType = 'Size';
            currentProduct.regularChildSkus = [{ skuId: '1234567' }, { skuId: '1234568' }];
            wrapper = shallow(
                <ShadeFilter
                    currentProduct={currentProduct}
                    applyFilters={applyFiltersSpy}
                />
            );

            expect(wrapper.find('FilterGroup').length).toEqual(0);
        });

        it('should not render a FilterGroup component when sku length is 0', () => {
            currentProduct.variationType = 'Size';
            currentProduct.regularChildSkus = [];
            wrapper = shallow(
                <ShadeFilter
                    currentProduct={currentProduct}
                    applyFilters={applyFiltersSpy}
                />
            );

            expect(wrapper.find('FilterGroup').length).toEqual(0);
        });

        it('should render a Clear button with a data-at attribute', () => {
            currentProduct.variationType = 'Color';
            currentProduct.regularChildSkus = [];
            wrapper = shallow(
                <ShadeFilter
                    currentProduct={currentProduct}
                    applyFilters={applyFiltersSpy}
                />
            );

            const buttons = component.buttons;
            const dataAtText = buttons.props.children[0].props['data-at'];

            expect(dataAtText).toEqual('swatch_clear_btn');
        });

        it('should render a Done button with a data-at attribute', () => {
            currentProduct.variationType = 'Color';
            currentProduct.regularChildSkus = [];
            wrapper = shallow(
                <ShadeFilter
                    currentProduct={currentProduct}
                    applyFilters={applyFiltersSpy}
                />
            );

            const buttons = component.buttons;
            const dataAtText = buttons.props.children[1].props['data-at'];

            expect(dataAtText).toEqual('swatch_done_btn');
        });
    });
});
