/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const ProductQuicklook = require('components/Product/ProductQuicklook/ProductQuicklook').default;
const store = require('store/Store').default;
const skuUtils = require('utils/Sku').default;
const snbApi = require('services/api/search-n-browse').default;
const quicklookModalUtils = require('utils/Quicklook').default;

describe('ProductQuicklook component', () => {
    let event;
    let getProductDetailsSpy;
    let dispatchQuicklookSpy;
    let component;
    let handleShowQuickLookModalSpy;
    let instancedComponent;

    beforeEach(() => {
        spyOn(store, 'dispatch');
        spyOn(store, 'subscribe');
    });

    describe('handle a quicklook request', () => {
        beforeEach(() => {
            event = {
                preventDefault: createSpy('preventDefault'),
                stopPropagation: createSpy('stopPropagation')
            };
            getProductDetailsSpy = spyOn(snbApi, 'getProductDetails').and.returnValue(
                Promise.resolve({
                    productId: 'P01',
                    displayName: 'Test Product',
                    currentSku: {
                        skuId: 'S01',
                        skuImages: {
                            image250: '/productimages/sku/s1960004-main-hero.jpg'
                        },
                        type: 'standard'
                    },
                    productStringContainerName: 'Product Container Name',
                    shortDescription: 'this is a description'
                })
            );

            dispatchQuicklookSpy = spyOn(quicklookModalUtils, 'dispatchQuicklook');
            component = shallow(<ProductQuicklook />);
            instancedComponent = component.instance();
        });

        it('should call dispatchQuicklook', () => {
            instancedComponent.handleShowQuickLookModal('P123', 'normal');
            expect(dispatchQuicklookSpy).toHaveBeenCalled();
        });

        it('should dispatch handleShowQuickLookModal as a Bi Reward', () => {
            handleShowQuickLookModalSpy = spyOn(instancedComponent, 'handleShowQuickLookModal');
            component.setProps({
                sku: {
                    biType: 'type',
                    productId: 'P123'
                }
            });
            instancedComponent.handleOnClick(event);
            expect(handleShowQuickLookModalSpy).toHaveBeenCalledWith('P123', 'reward');
        });

        it('should dispatch handleShowQuickLookModal as a Sample', () => {
            handleShowQuickLookModalSpy = spyOn(instancedComponent, 'handleShowQuickLookModal');
            component.setProps({
                sku: {
                    type: 'sample',
                    productId: 'P123'
                }
            });
            instancedComponent.handleOnClick(event);
            expect(handleShowQuickLookModalSpy).toHaveBeenCalledWith('P123', 'sample', { propertiesToSkip: 'childSkus' });
        });

        it('should dispatch handleShowQuickLookModal as Standard', () => {
            handleShowQuickLookModalSpy = spyOn(instancedComponent, 'handleShowQuickLookModal');
            component.setProps({ sku: { productId: 'P123' } });
            instancedComponent.handleOnClick(event);
            expect(handleShowQuickLookModalSpy).toHaveBeenCalledWith('P123', 'standard', { addCurrentSkuToProductChildSkus: true });
        });
    });
});
