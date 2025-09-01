const React = require('react');
const { shallow } = require('enzyme');
const store = require('store/Store').default;
const Samples = require('components/Samples/Samples').default;

describe('Samples component', () => {
    let component;
    let getStateStub;
    let samplesObj;
    let subscribeStub;

    beforeEach(() => {
        subscribeStub = spyOn(store, 'subscribe');

        samplesObj = {
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
            ]
        };

        getStateStub = spyOn(store, 'getState').and.returnValue({ samples: samplesObj });
    });

    describe('Samples controller', () => {
        it('should get samples object from store and set up samples watch', () => {
            const wrapper = shallow(<Samples />);
            component = wrapper.instance();
            expect(getStateStub).toHaveBeenCalledTimes(2);
        });

        it('should set samples list with data from store', () => {
            const wrapper = shallow(<Samples />);
            component = wrapper.instance();
            expect(component.state.samplesList).toBe(samplesObj.samples);
        });

        it('should set allowed samples per order with data from store', () => {
            const wrapper = shallow(<Samples />);
            component = wrapper.instance();
            expect(component.state.allowedQtyPerOrder).toBe(samplesObj.allowedQtyPerOrder);
        });

        it('should subscribe to samples store', () => {
            const wrapper = shallow(<Samples />);
            component = wrapper.instance();
            expect(subscribeStub).toHaveBeenCalledTimes(1);
        });
    });
});
