/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');
const PaymentDisplay = require('components/Checkout/Sections/Payment/Display/PaymentDisplay').default;

describe('<PaymentDisplay /> component', () => {
    let wrapper;
    let component;

    const renderWithProps = (props = {}) => {
        wrapper = shallow(<PaymentDisplay {...props} />);
        component = wrapper.instance();
    };

    const filterStoreCreditNodes = () => {
        return wrapper.findWhere(n => {
            const key = n.key();

            return key && key.indexOf('storeCredits_') === 0;
        });
    };

    describe('store credits', () => {
        const storeCredits = [
            {
                amount: '$5.00',
                expirationDate: '2021-03-07 00:00:00.0'
            },
            {
                amount: '$6.00',
                expirationDate: '2021-12-17 00:00:00.0'
            },
            {
                amount: '$6.00',
                expirationDate: null
            }
        ];

        beforeEach(() => {
            renderWithProps({ storeCredits });
        });

        it('should render correct number of store credits', () => {
            expect(filterStoreCreditNodes().length).toEqual(3);
        });

        it('should not render store credits if storeCredits prop is missing', () => {
            renderWithProps({ storeCredits: [] });
            expect(filterStoreCreditNodes().length).toEqual(0);
        });

        it('should render icon', () => {
            const nodes = filterStoreCreditNodes();

            for (let i = 0; i < 3; i++) {
                expect(nodes.at(i).find('Image').length).toEqual(1);
            }
        });

        it('should render ammount', () => {
            const nodes = filterStoreCreditNodes();

            for (let i = 0; i < storeCredits.length; i++) {
                expect(nodes.at(i).find('div').childAt(0).text()).toEqual(`Account Credit Applied: ${storeCredits[i].amount}`);
            }
        });

        it('should render exp date if present', () => {
            const first = filterStoreCreditNodes().at(0);
            expect(first.find('div').childAt(2).text()).toEqual('Expires: 3/7/2021');
        });

        xit('should not render exp date if missing', () => {
            const last = filterStoreCreditNodes().at(2);
            expect(last.find('Box').childAt(2).text()).toEqual('');
        });
    });
});
