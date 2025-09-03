const React = require('react');
const { shallow } = require('enzyme');

describe('LoveIcon', () => {
    let LoveIcon;
    let wrapper;

    beforeEach(() => {
        LoveIcon = require('components/ProductPage/ProductLove/LoveIcon').default;
    });

    describe('should render LoveIcon', () => {
        beforeEach(() => {
            const props = {
                currentProduct: {
                    productDetails: {
                        brand: {
                            displayName: 'productTest'
                        },
                        productId: 123456
                    }
                },
                sku: { skuId: 2164606 },
                loveSource: 'productPage',
                productId: 'P123456'
            };
            wrapper = shallow(<LoveIcon {...props} />);
        });

        it('as the root component', () => {
            expect(wrapper.first().is('LoveIcon')).toBeTruthy();
        });

        it('with mouseEnter prop', () => {
            expect(wrapper.find('LoveIcon').prop('mouseEnter')).toBeDefined();
        });

        it('with mouseLeave prop', () => {
            expect(wrapper.find('LoveIcon').prop('mouseLeave')).toBeDefined();
        });

        it('with skuLoveData prop', () => {
            expect(wrapper.find('LoveIcon').prop('skuLoveData')).toBeDefined();
        });

        it('with isActive prop', () => {
            expect(wrapper.find('LoveIcon').prop('isActive')).toBeDefined();
        });

        it('with hover prop', () => {
            expect(wrapper.find('LoveIcon').prop('hover')).toBeDefined();
        });
    });
});
