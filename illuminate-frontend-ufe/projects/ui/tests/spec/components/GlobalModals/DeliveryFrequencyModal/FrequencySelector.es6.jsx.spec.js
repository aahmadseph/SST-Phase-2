const { shallow } = require('enzyme');
const React = require('react');

describe('FrequencySelector component', () => {
    let FrequencySelector;
    let props;
    let newProps;
    let wrapper;

    beforeEach(() => {
        FrequencySelector = require('components/GlobalModals/DeliveryFrequencyModal/FrequencySelector').default;

        props = {
            onDismiss: () => {},
            handleFrequency: () => {},
            title: 'Delivery Frequency',
            currentProduct: {
                currentSku: {
                    skuId: '1',
                    replenishmentFreqNum: 5,
                    replenishmentFreqType: 'Weeks'
                }
            },
            replenishmentFreqNum: 5,
            replenishmentFreqType: 'Weeks',
            frequencyTypes: ['Weeks', 'Months'],
            frequencyValues: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        };
        newProps = {
            ...props,
            isMostCommon: true
        };
    });

    it('should render Chiclet components for small UI', () => {
        const newState = {
            isLargeView: false
        };
        wrapper = shallow(<FrequencySelector {...props} />);
        wrapper.setState(newState);

        const Chiclet = wrapper.find('Chiclet');

        expect(Chiclet.length).toBe(10);
    });

    describe('should render Chiclet', () => {
        const newState = {
            isLargeView: false
        };

        it('with legend "Most Common" only in one item if it is true', () => {
            wrapper = shallow(<FrequencySelector {...newProps} />);
            wrapper.setState(newState);

            const Chiclet = wrapper.findWhere(n => n.name() === 'Chiclet' && n.prop('children') === '5 (Most Common)');

            expect(Chiclet.length).toBe(1);
        });

        it('without legend "Most Common" if the combination is not the most common', () => {
            newProps.isMostCommon = false;
            wrapper = shallow(<FrequencySelector {...newProps} />);
            wrapper.setState(newState);

            const Chiclet = wrapper.findWhere(n => n.name() === 'Chiclet' && n.prop('children') === '5 (Most Common)');

            expect(Chiclet.length).toBe(0);
        });
    });
});
