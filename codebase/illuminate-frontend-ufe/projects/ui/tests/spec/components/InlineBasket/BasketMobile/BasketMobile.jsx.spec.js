const React = require('react');
const { shallow } = require('enzyme');

describe('BasketMobile component', () => {
    let anaConsts;
    let anaUtils;
    let BasketMobile;
    let processEvent;
    let Location;

    beforeEach(() => {
        anaConsts = require('analytics/constants').default;
        anaUtils = require('analytics/utils').default;
        processEvent = require('analytics/processEvent').default;
        Location = require('utils/Location').default;
        BasketMobile = require('components/InlineBasket/BasketMobile/BasketMobile').default;

        const Events = require('utils/framework/Events').default;
        spyOn(Events, 'onLastLoadEvent').and.callFake(() => {});
    });

    it('Test analytics should trigger s.t. call when modal is opened', () => {
        // Arrange

        const previousProps = {
            isOpen: false,
            basket: {
                items: [
                    {
                        sku: {
                            skuId: '2168656',
                            biType: 'celebration gift',
                            productId: 'productId',
                            productName: 'productName'
                        }
                    }
                ]
            }
        };

        const props = {
            isOpen: true,
            basket: {
                items: [
                    {
                        sku: {
                            skuId: '2168656',
                            biType: 'celebration gift',
                            productId: 'productId',
                            productName: 'productName'
                        }
                    }
                ]
            }
        };
        const analyticsStub = spyOn(processEvent, 'process');
        spyOn(Location, 'isProductPage').and.returnValue(true);

        // Act
        const wrapper = shallow(<BasketMobile {...props} />, { disableLifecycleMethods: true }).setState({ isMounted: true });

        wrapper.instance().componentDidUpdate(previousProps, props);

        // Assert
        expect(analyticsStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `add to basket modal:${props.basket.items[0].sku.productId}:n/a:*pname=${props.basket.items[0].sku.productName}`,
                productStrings: anaUtils.buildSingleProductString({ sku: props.basket.items[0].sku }),
                pageType: 'add to basket modal',
                pageDetail: props.basket.items[0].sku.productId
            }
        });
    });
});
