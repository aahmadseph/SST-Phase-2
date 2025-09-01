/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');
const { createSpy } = jasmine;
const AfterpayPaymentMethod = require('components/Afterpay/AfterpayPaymentMethod/AfterpayPaymentMethod').default;

describe('AfterpayPaymentMethod', () => {
    let props;

    beforeEach(() => {
        props = {
            amount: 111,
            legalNotice: 'Some legal notice',
            loadWidget: createSpy('loadWidget'),
            updateWidget: createSpy('updateWidget'),
            isAnonymous: () => false
        };
    });

    describe('render', () => {
        it('should render afterpay widget wrapper', () => {
            const wrapper = shallow(<AfterpayPaymentMethod {...props} />);
            expect(wrapper.find('[id="afterpay_widget_wrapper"]').exists()).toBeTruthy();
        });

        it('should render afterpay legal notice with a given text', () => {
            const wrapper = shallow(<AfterpayPaymentMethod {...props} />);
            const element = wrapper.findWhere(x => x.key() === 'afterpayLegalNotice' && x.prop('children') === props.legalNotice);
            expect(element.exists()).toBeTruthy();
        });

        it('should not render DefaultPaymentCheckbox for anonymous user', () => {
            props.isAnonymous = true;
            const wrapper = shallow(<AfterpayPaymentMethod {...props} />);
            const element = wrapper.find('DefaultPaymentCheckbox');
            expect(element.exists()).toBeFalsy();
        });

        it('should render DefaultPaymentCheckbox for Afterpay for signed in user', () => {
            props.isAnonymous = false;
            const wrapper = shallow(<AfterpayPaymentMethod {...props} />);
            const element = wrapper.findWhere(x => x.name() === 'DefaultPaymentCheckbox' && x.prop('paymentName') === 'afterpay');
            expect(element.exists()).toBeFalsy();
        });
    });

    describe('componentDidMount', () => {
        it('should call loadWidget', () => {
            const wrapper = shallow(<AfterpayPaymentMethod {...props} />);
            const component = wrapper.instance();
            expect(component.props.loadWidget).toHaveBeenCalled();
        });
    });

    describe('componentDidUpdate', () => {
        it('should call updateWidgetSpy if amount has been changed', () => {
            const wrapper = shallow(<AfterpayPaymentMethod {...props} />);
            const component = wrapper.instance();
            component.componentDidUpdate({ amount: 888 });
            expect(component.props.updateWidget).toHaveBeenCalledTimes(1);
        });
    });
});
