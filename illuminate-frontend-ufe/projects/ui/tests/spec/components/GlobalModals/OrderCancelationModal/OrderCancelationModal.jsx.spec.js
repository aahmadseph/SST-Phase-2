const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const localeUtils = require('utils/LanguageLocale').default;
const OrderCancelationModal = require('components/GlobalModals/OrderCancelationModal/OrderCancelationModal').default;

describe('OrderCancelationModal component', () => {
    let wrapper;
    let props;
    let component;
    let submitButton;
    let getTextStub;
    const REASON_CODES = {
        MODIFY_ITEMS: '31',
        ADD_PROMO: '32',
        CHANGE_ADDRESS: '33',
        CHANGE_PAYMENT_METHOD: '34',
        OTHER: '40'
    };

    beforeEach(() => {
        getTextStub = createSpy('getTextStub').and.returnValue('translatedText');
        spyOn(localeUtils, 'getLocaleResourceFile').and.returnValue(getTextStub);
        props = {
            selfCancelationReasons: {
                otherReasonCode: '40',
                reasonCodes: [
                    {
                        reasonCode: '31',
                        description: 'I want to modify the items in my order'
                    },
                    {
                        reasonCode: '32',
                        description: 'I forgot to add a promo code'
                    },
                    {
                        reasonCode: '33',
                        description: 'I want to change the shipping address'
                    },
                    {
                        reasonCode: '34',
                        description: 'I want to change the payment method'
                    },
                    {
                        reasonCode: '40',
                        description: 'Other'
                    }
                ]
            }
        };
        wrapper = shallow(<OrderCancelationModal {...props} />);
        component = wrapper.find('Radio');
    });

    using(
        'Radio Data',
        [
            {
                reason: 'modifies the items',
                reasonCode: REASON_CODES.MODIFY_ITEMS,
                index: 0
            },
            {
                reason: 'adds a promo',
                reasonCode: REASON_CODES.ADD_PROMO,
                index: 1
            },
            {
                reason: 'changes the address',
                reasonCode: REASON_CODES.CHANGE_ADDRESS,
                index: 2
            },
            {
                reason: 'changes the payment method',
                reasonCode: REASON_CODES.CHANGE_PAYMENT_METHOD,
                index: 3
            },
            {
                reason: 'describes some another reason',
                reasonCode: REASON_CODES.OTHER,
                index: 4
            }
        ],
        radio => {
            it('should set the proper reason code when user ' + radio.reason, () => {
                component.at(radio.index).simulate('change');
                expect(wrapper.instance().state.reasonCode).toEqual(radio.reasonCode);
            });

            if (radio.reasonCode !== REASON_CODES.OTHER) {
                it('should enable Submit button if user ' + radio.reason, () => {
                    component.at(radio.index).simulate('change');
                    submitButton = wrapper.find('Button').at(0);
                    expect(submitButton.props().disabled).toBeFalsy();
                });
            } else {
                it('should keep Submit button disabled if user selected OTHER reason ' + 'without any text provided', () => {
                    component.at(radio.index).simulate('change');
                    submitButton = wrapper.find('Button').at(0);
                    expect(submitButton.props().disabled).toBeFalsy();
                });

                it('should limit the user input by 150 characters', () => {
                    expect(wrapper.find('Textarea').at(0).props().maxLength).toEqual(150);
                });

                it('should display the Textarea Error if form submitted and text is empty', () => {
                    wrapper.setState({
                        reasonCode: props.selfCancelationReasons.otherReasonCode,
                        reasonText: '',
                        showReasonTextError: true
                    });
                    expect(wrapper.find('Textarea').at(0).props().message).toEqual('translatedText');
                });

                it('should highlight the Textarea with red if form submitted and text is empty', () => {
                    wrapper.setState({
                        reasonCode: props.selfCancelationReasons.otherReasonCode,
                        reasonText: '',
                        showReasonTextError: true
                    });
                    expect(wrapper.find('Textarea').at(0).props().invalid).toBeTruthy();
                });

                it('should not highlight the Textarea if reason is not Other', () => {
                    wrapper.setState({
                        reasonCode: 'some reason',
                        reasonText: '',
                        showReasonTextError: true
                    });
                    expect(wrapper.find('Textarea').at(0).props().invalid).toBeFalsy();
                });

                it('should not display the Textarea Error if reason Text presented', () => {
                    wrapper.setState({
                        reasonCode: props.selfCancelationReasons.otherReasonCode,
                        reasonText: 'some reason',
                        showReasonTextError: true
                    });
                    expect(wrapper.find('Textarea').at(0).props().message).toEqual(null);
                });
            }
        }
    );
});
