const { shallow } = require('enzyme');
const React = require('react');
const UnsubscribeAutoReplenModal = require('components/GlobalModals/UnsubscribeAutoReplenModal/UnsubscribeAutoReplenModal').default;

describe('UnsubscribeAutoReplenModal component', () => {
    let propsNoRatingNoVariation;
    let props;
    let wrapper;
    beforeEach(() => {
        propsNoRatingNoVariation = {
            isOpen: true,
            onDismiss: () => {},
            title: 'Unsubscribe',
            subscription: {
                aggregateDiscount: '$8.40',
                createdDate: '2022-03-23T15:08:42',
                items: [
                    {
                        brandName: 'CLINIQUE',
                        discountAmount: '10.0',
                        discountId: 'promo6120002',
                        discountType: 'P',
                        discountedPrice: '$18.90',
                        price: '$21.00',
                        productId: 'P122735',
                        productName: 'Take The Day Off Makeup Remover For Lids, Lashes & Lips',
                        qty: 4,
                        skuId: '48074',
                        skuImages: {
                            image62: 'https://qa4.sephora.com/productimages/sku/s48074-main-Lthumb.jpg',
                            image97: 'https://qa4.sephora.com/productimages/sku/s48074-main-Sgrid.jpg',
                            image135: 'https://qa4.sephora.com/productimages/sku/s48074-main-grid.jpg',
                            image162: 'https://qa4.sephora.com/productimages/sku/s48074-162.jpg',
                            image250: 'https://qa4.sephora.com/productimages/sku/s48074-main-hero.jpg',
                            image450: 'https://qa4.sephora.com/productimages/sku/s48074-main-Lhero.jpg'
                        },
                        yearlySavings: '$16.80'
                    }
                ]
            }
        };

        props = {
            ...propsNoRatingNoVariation,
            subscription: {
                ...propsNoRatingNoVariation.subscription,
                items: [
                    {
                        ...propsNoRatingNoVariation.subscription,
                        reviewsCount: 73,
                        starRatings: 4.4247,
                        variationType: 'Size',
                        variationTypeDisplayName: 'Size',
                        variationValue: '4.2 oz/ 125 mL'
                    }
                ]
            }
        };
    });

    it('should render ProductImage component', () => {
        wrapper = shallow(<UnsubscribeAutoReplenModal {...props} />);
        wrapper.update();
        const ProductImage = wrapper.find('ProductImage');

        expect(ProductImage.length).toBe(1);
    });

    it('should render StarRating component', () => {
        wrapper = shallow(<UnsubscribeAutoReplenModal {...props} />);
        wrapper.update();
        const StarRating = wrapper.find('StarRating');

        expect(StarRating.length).toBe(1);
    });

    it('should render UnsubscribeAutoReplenModalCTA component', () => {
        wrapper = shallow(<UnsubscribeAutoReplenModal {...props} />);
        wrapper.update();

        const UnsubscribeAutoReplenCTA = wrapper.find('UnsubscribeAutoReplenCTA');

        expect(UnsubscribeAutoReplenCTA.length).toBe(1);
    });

    it('should NOT render StarRating component', () => {
        wrapper = shallow(<UnsubscribeAutoReplenModal {...propsNoRatingNoVariation} />);
        wrapper.update();

        const StarRating = wrapper.find('StarRating');

        expect(StarRating.length).toBe(0);
    });
});
