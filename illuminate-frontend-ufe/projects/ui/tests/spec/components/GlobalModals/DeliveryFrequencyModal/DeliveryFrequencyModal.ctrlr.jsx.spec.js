const { shallow } = require('enzyme');
const React = require('react');
const DeliveryFrequencyModal = require('components/GlobalModals/DeliveryFrequencyModal/DeliveryFrequencyModal').default;

describe('DeliveryFrequencyModal component', () => {
    let props;
    let propsNoRating;
    let wrapper;
    beforeEach(() => {
        propsNoRating = {
            isOpen: true,
            onDismiss: () => {},
            title: 'Delivery Frequency',
            currentProduct: {
                currentSku: {
                    skuId: '1',
                    replenishmentFreqNum: 5,
                    replenishmentFreqType: 'Weeks'
                }
            },
            replenishmentFreqNum: 5,
            replenishmentFreqType: 'Weeks'
        };

        props = {
            ...propsNoRating,
            currentProduct: {
                ...propsNoRating.currentProduct,
                productDetails: {
                    reviews: 5,
                    rating: 4
                }
            }
        };
    });

    it('should render FrequencySelector component', () => {
        wrapper = shallow(<DeliveryFrequencyModal {...propsNoRating} />);
        wrapper.update();
        const FrequencySelector = wrapper.find('FrequencySelector');

        expect(FrequencySelector.length).toBe(1);
    });

    it('should render ProductImage component', () => {
        wrapper = shallow(<DeliveryFrequencyModal {...propsNoRating} />);
        wrapper.update();
        const ProductImage = wrapper.find('ProductImage');

        expect(ProductImage.length).toBe(1);
    });

    it('should render StarRating component', () => {
        wrapper = shallow(<DeliveryFrequencyModal {...props} />);
        wrapper.update();
        const StarRating = wrapper.find('StarRating');

        expect(StarRating.length).toBe(1);
    });

    it('should render DeliveryFrequencyCTA component', () => {
        wrapper = shallow(<DeliveryFrequencyModal {...props} />);
        wrapper.update();

        const DeliveryFrequencyCTA = wrapper.find('DeliveryFrequencyCTA');

        expect(DeliveryFrequencyCTA.length).toBe(1);
    });

    it('should NOT render StarRating component', () => {
        wrapper = shallow(<DeliveryFrequencyModal {...propsNoRating} />);
        wrapper.update();

        const StarRating = wrapper.find('StarRating');

        expect(StarRating.length).toBe(0);
    });

    it('should render the right title', () => {
        wrapper = shallow(<DeliveryFrequencyModal {...propsNoRating} />);
        const title = wrapper.findWhere(n => n.name() === 'ModalTitle' && n.props().children === props.title);

        expect(title.length).toBe(1);
    });
});
