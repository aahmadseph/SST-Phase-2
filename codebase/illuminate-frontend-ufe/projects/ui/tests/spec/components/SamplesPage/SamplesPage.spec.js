/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');

describe('SamplesPage component', () => {
    let SamplesPage;
    let store;
    let component;
    let props;
    let getState;
    let dispatch;
    let subscribe;

    beforeEach(() => {
        store = require('store/Store').default;
        subscribe = spyOn(store, 'subscribe');
        dispatch = spyOn(store, 'dispatch');
        SamplesPage = require('components/SamplesPage/SamplesPage').default;

        props = {
            data: {
                allowedQtyPerOrder: '3',
                samplesPageMessage: 'Select up to 3 samples',
                samples: [
                    {
                        targetUrl: '/product/acqua-di-gio-pour-homme-P12430?skuId=397281',
                        skuId: '880567',
                        primaryProduct: {
                            productId: 'P370205',
                            rating: 4.0
                        },
                        gridImage: '/productimages/sku/s880567-main-grid.jpg',
                        fullSizeProduct: {
                            productId: 'P12430',
                            rating: 4.6436
                        },
                        skuImages: {
                            image42: '/productimages/sku/s880567-main-thumb.jpg',
                            image50: '/productimages/sku/s880567-main-thumb-50.jpg',
                            image62: '/productimages/sku/s880567-main-Lthumb.jpg',
                            image97: '/productimages/sku/s880567-main-Sgrid.jpg',
                            image135: '/productimages/sku/s880567-main-grid.jpg',
                            image250: '/productimages/sku/s880567-main-hero.jpg',
                            image300: '/productimages/sku/s880567-main-hero-300.jpg',
                            image450: '/productimages/sku/s880567-main-Lhero.jpg',
                            image1500: '/productimages/sku/s880567-main-zoom.jpg',
                            image162: '/productimages/sku/s880567-162.jpg'
                        }
                    },
                    {
                        targetUrl: '/product/b-hydra-intensive-hydration-gel-P406712',
                        skuId: '2022549',
                        primaryProduct: {
                            productId: 'P370205',
                            rating: 4.0
                        },
                        gridImage: '/productimages/sku/s2022549-main-grid.jpg',
                        fullSizeProduct: { productId: 'P406712' },
                        skuImages: {
                            image42: '/productimages/sku/s2022549-main-thumb.jpg',
                            image50: '/productimages/sku/s2022549-main-thumb-50.jpg',
                            image62: '/productimages/sku/s2022549-main-Lthumb.jpg',
                            image97: '/productimages/sku/s2022549-main-Sgrid.jpg',
                            image135: '/productimages/sku/s2022549-main-grid.jpg',
                            image250: '/productimages/sku/s2022549-main-hero.jpg',
                            image300: '/productimages/sku/s2022549-main-hero-300.jpg',
                            image450: '/productimages/sku/s2022549-main-Lhero.jpg',
                            image1500: '/productimages/sku/s2022549-main-zoom.jpg',
                            image162: '/productimages/sku/s2022549-162.jpg'
                        }
                    }
                ],
                regions: {
                    left: [],
                    right: []
                }
            }
        };
    });

    describe('SamplesPage controller', () => {
        beforeEach(() => {
            const wrapper = shallow(<SamplesPage {...props} />);
            component = wrapper.instance();
        });

        it('should update store with samples from page JSON', () => {
            component.componentDidMount();
            expect(dispatch).toHaveBeenCalled();
        });

        it('should initially set number of samples in basket', () => {
            getState = spyOn(store, 'getState').and.returnValues({
                basket: {
                    isInitialized: true,
                    samples: [{ sample: 'sample' }, { sample: 'sample' }]
                }
            });

            component.componentDidMount();
            expect(component.state.samplesInBasket).toBe(2);
        });

        it('should subscribe to basket and basket.samples if not initialized', () => {
            getState = spyOn(store, 'getState').and.returnValues({ basket: { isInitialized: false } });

            component.componentDidMount();
            expect(subscribe).toHaveBeenCalled();
        });

        it('should subscribe to only basket.samples if basket is initialized', () => {
            getState = spyOn(store, 'getState').and.returnValues({
                basket: {
                    isInitialized: true,
                    samples: [{ sample: 'sample' }, { sample: 'sample' }]
                }
            });

            component.componentDidMount();
            expect(subscribe).toHaveBeenCalled();
        });
    });

    describe('data-at attributes are correct', () => {
        it('parragraph with dataAt=samples_label', () => {
            const wrapper = shallow(<SamplesPage {...props} />);
            expect(wrapper.findWhere(node => node.prop('data-at') === 'samples_label').exists()).toBe(true);
        });
    });
});
