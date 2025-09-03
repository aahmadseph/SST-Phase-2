/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');
const { createSpy } = jasmine;
const DefaultPaymentCheckbox = require('components/Checkout/Sections/Payment/Section/DefaultPaymentCheckbox/DefaultPaymentCheckbox').default;

describe('DefaultPaymentCheckbox component', () => {
    let props;

    beforeEach(() => {
        props = {
            paymentName: 'somePaymentName',
            checked: false,
            disabled: false,
            setAsDefaultPaymentLabel: 'some label',
            setAsDefaultPaymentNoticeLabel: 'some notice label',
            onClick: createSpy('onClick')
        };
    });

    it('should render checked Checkbox when checked is true', () => {
        props.checked = true;
        const wrapper = shallow(<DefaultPaymentCheckbox {...props} />);
        const element = wrapper.findWhere(x => x.name() === 'Checkbox' && x.prop('checked') === true);
        expect(element.exists()).toBeTruthy();
    });

    it('should render unchecked Checkbox when checked is false', () => {
        props.checked = false;
        const wrapper = shallow(<DefaultPaymentCheckbox {...props} />);
        const element = wrapper.findWhere(x => x.name() === 'Checkbox' && x.prop('checked') === false);
        expect(element.exists()).toBeTruthy();
    });

    it('should render disabled Checkbox when disabled is true', () => {
        props.disabled = true;
        const wrapper = shallow(<DefaultPaymentCheckbox {...props} />);
        const element = wrapper.findWhere(x => x.name() === 'Checkbox' && x.prop('disabled') === true);
        expect(element.exists()).toBeTruthy();
    });

    it('should render enabled Checkbox when disabled is false', () => {
        props.disabled = false;
        const wrapper = shallow(<DefaultPaymentCheckbox {...props} />);
        const element = wrapper.findWhere(x => x.name() === 'Checkbox' && x.prop('disabled') === false);
        expect(element.exists()).toBeTruthy();
    });

    it('should render Checkbox witha given text', () => {
        const wrapper = shallow(<DefaultPaymentCheckbox {...props} />);
        const element = wrapper.findWhere(x => x.name() === 'Checkbox' && x.prop('children') === props.setAsDefaultPaymentLabel);
        expect(element.exists()).toBeTruthy();
    });

    it('should render Text with a given label', () => {
        const wrapper = shallow(<DefaultPaymentCheckbox {...props} />);
        const element = wrapper.findWhere(x => x.name() === 'Text' && x.prop('children') === props.setAsDefaultPaymentNoticeLabel);
        expect(element.exists()).toBeTruthy();
    });

    it('should call onClick callback with appropriate paymentName on Checkbox click', () => {
        const wrapper = shallow(<DefaultPaymentCheckbox {...props} />);
        const checkbox = wrapper.findWhere(x => x.name() === 'Checkbox');
        checkbox.simulate('click');
        expect(props.onClick).toHaveBeenCalledWith(props.paymentName);
    });
});
