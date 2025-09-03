const React = require('react');
const { shallow } = require('enzyme');
const OtherPayments = require('components/RichProfile/MyAccount/Payments/OtherPayments/OtherPayments.ctrlr').default;

describe('OtherPayments', () => {
    it('renders without crashing', () => {
        const wrapper = shallow(<OtherPayments />);
        expect(wrapper.exists()).toBe(true);
    });
});
