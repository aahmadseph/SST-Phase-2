const React = require('react');
// eslint-disable-next-line object-curly-newline
const { shallow } = require('enzyme');
const store = require('Store').default;
const ProductQuickLookModal = require('components/GlobalModals/QuickLookModal/ProductQuickLookModal/ProductQuickLookModal').default;
const anaConsts = require('analytics/constants').default;
const skuUtils = require('utils/Sku').default;
const anaUtils = require('analytics/utils').default;

describe('ProductQuickLookModal component', () => {
    let setStateStub;
    let setNextPageDataStub;
    let props;
    let wrapper;

    beforeEach(() => {
        spyOn(store, 'dispatch');
        const currentSku = {
            type: 'Standart',
            skuImages: {},
            biExclusiveLevel: '',
            actionFlags: {},
            targetUrl: '/product/test',
            listPrice: '$21.00',
            skuId: '123'
        };
        props = {
            currentSku,
            product: {
                brand: {},
                regularChildSkus: [],
                currentSku,
                productId: 'PID123',
                displayName: 'ProductStub',
                productStringContainerName: 'test',
                shortDescription: 'test',
                productDetails: { lovesCount: 10 }
            },
            matchSku: 'gsdfgsdgr',
            isOpen: true
        };
        spyOn(skuUtils, 'productUrl').and.returnValue(false);
        spyOn(skuUtils, 'isSubscription').and.returnValue(false);
        spyOn(skuUtils, 'isGiftCard').and.returnValue(false);
        spyOn(skuUtils, 'isGwp').and.returnValue(false);
        spyOn(skuUtils, 'isSample').and.returnValue(false);
        spyOn(skuUtils, 'isEGiftCard').and.returnValue(false);
        setNextPageDataStub = spyOn(anaUtils, 'setNextPageData');
    });

    describe('Shade Code', () => {
        xit('should be set for the user to current sku if shade code is provided in url', () => {
            wrapper = shallow(<ProductQuickLookModal {...props} />);
            expect(wrapper.find('ProductSwatchGroup').prop('matchSku')).toEqual(props.currentSku);
        });

        // TODO: workaround needed for FocusTrap component
        xit('should be set for the user to null if shade code is not provided in url', () => {
            const expectedProps = Object.assign({}, props);
            expectedProps.matchSku = null;
            wrapper = shallow(<ProductQuickLookModal {...expectedProps} />);
            expect(wrapper.find('ProductSwatchGroup').prop('matchSku')).toEqual(null);
        });
    });

    describe('Handle Sku Quantity', () => {
        it('should change the sku quantity', () => {
            const value = 2;
            wrapper = shallow(<ProductQuickLookModal {...props} />);
            const component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            component.componentDidMount();

            component.handleSkuQuantity(value);
            expect(setStateStub).toHaveBeenCalledWith({ skuQuantity: value });
        });
    });

    describe('openPPage function', () => {
        beforeEach(() => {
            // eslint-disable-next-line no-undef
            digitalData.event = [
                {
                    eventInfo: {
                        eventName: 'asyncPageLoad',
                        attributes: {
                            pageType: 'quicklook',
                            pageName: 'quicklook pageName'
                        }
                    }
                }
            ];
        });
        describe('Platform Value Available', () => {
            const platform = 'chat';

            beforeEach(() => {
                props.platform = platform;
                wrapper = shallow(<ProductQuickLookModal {...props} />);
                const component = wrapper.instance();
                setStateStub = spyOn(component, 'setState');
                component.fireLinkTracking(platform);
            });

            it('should call setNexPageData with correct args', () => {
                expect(setNextPageDataStub).toHaveBeenCalledWith({
                    pageName: 'quicklook pageName',
                    linkData: `cmnty:${platform}:product-tag-click-to-ppage`,
                    events: [anaConsts.Event.EVENT_162]
                });
            });
        });

        describe('Platform Value Not Available', () => {
            beforeEach(() => {
                wrapper = shallow(<ProductQuickLookModal {...props} />);
                const component = wrapper.instance();
                setStateStub = spyOn(component, 'setState');
                component.fireLinkTracking();
            });

            it('should call setNexPageData with correct args', () => {
                expect(setNextPageDataStub).toHaveBeenCalledWith({ pageName: 'quicklook pageName' });
            });
        });
    });

    describe('CallToAction component for small viewports', () => {
        let state;
        beforeEach(() => {
            state = { isSmallView: true };
            wrapper = shallow(<ProductQuickLookModal {...props} />);
            wrapper.setState(state);
            const component = wrapper.instance();
            component.render();
        });

        it('should render if error is false', () => {
            expect(wrapper.find('CallToActions').at(0)).not.toBeNull();
        });

        it('should render with prop currentSku', () => {
            expect(wrapper.find('CallToActions').at(0).props().currentSku).toBeDefined();
        });

        it('should render with prop currentProduct', () => {
            expect(wrapper.find('CallToActions').at(0).props().currentProduct).toBeDefined();
        });

        it('should render Grid component if error is true', () => {
            wrapper.setProps({ error: true });
            expect(wrapper.find('Grid').at(0)).not.toBeNull();
        });
    });
});
