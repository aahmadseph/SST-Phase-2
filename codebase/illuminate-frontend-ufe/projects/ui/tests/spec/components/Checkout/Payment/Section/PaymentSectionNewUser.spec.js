/* eslint-disable object-curly-newline */
const React = require('react');
const { any } = jasmine;
const { shallow } = require('enzyme');

describe('PaymentSectionNewUser component', () => {
    const PayPal = require('utils/PayPal').default;
    const PaymentSectionNewUser = require('components/Checkout/Sections/Payment/Section/PaymentSectionNewUser/PaymentSectionNewUser').default;
    const store = require('store/Store').default;
    const utilityApi = require('services/api/utility').default;
    const EditDataActions = require('actions/EditDataActions').default;
    const FormsUtils = require('utils/Forms').default;
    const checkoutUtils = require('utils/Checkout').default;

    let component;
    let props;
    let getStateStub;
    let getCountryListStub;
    let setAndWatch;
    let setAndWatchStub;
    let setNewCreditCardStub;
    let preparePaypalCheckoutStub;
    let updateEditDataStub;
    let getStateData;
    let billingCountriesData;
    let isGuestOrderStub;

    beforeEach(() => {
        spyOn(store, 'dispatch');
    });

    describe('Init Controller', () => {
        beforeEach(() => {
            setAndWatch = store.setAndWatch;
            setAndWatchStub = spyOn(store, 'setAndWatch');
            getStateData = {
                editData: {
                    [FormsUtils.FORMS.CHECKOUT.BILLING_COUNTRIES_LIST]: 'billingCountries'
                },
                order: {
                    orderDetails: {
                        header: {
                            isGuestOrder: true
                        }
                    }
                }
            };
            getStateStub = spyOn(store, 'getState').and.returnValue(getStateData);
            preparePaypalCheckoutStub = spyOn(PayPal, 'preparePaypalCheckout');
            updateEditDataStub = spyOn(EditDataActions, 'updateEditData');
            billingCountriesData = {};
            getCountryListStub = spyOn(utilityApi, 'getCountryList').and.returnValue({
                then: function (callback) {
                    callback(billingCountriesData);
                }
            });
            isGuestOrderStub = spyOn(checkoutUtils, 'isGuestOrder');
            props = {
                creditCardPaymentGroup: {},
                isPayPalEnabled: true
            };
            const wrapper = shallow(<PaymentSectionNewUser {...props} />);
            component = wrapper.instance();
            setNewCreditCardStub = spyOn(component, 'setNewCreditCard');
        });

        it('should set new credit card data if available', () => {
            component.componentDidMount();
            expect(setNewCreditCardStub).toHaveBeenCalledWith(props.creditCardPaymentGroup);
        });

        it('should set and watch for order price info', () => {
            // Arrange
            store.setAndWatch = setAndWatch;
            setAndWatchStub = spyOn(store, 'setAndWatch');

            // Act
            const wrapper = shallow(<PaymentSectionNewUser {...props} />);

            // Assert
            component = wrapper.instance();
            expect(setAndWatchStub).toHaveBeenCalledWith('order.orderDetails.priceInfo', component, any(Function));
        });

        it('should prepare paypal checkout', () => {
            const priceInfoWatcherCallback = setAndWatchStub.calls.first().args[2];
            priceInfoWatcherCallback();
            expect(preparePaypalCheckoutStub).toHaveBeenCalledTimes(1);
        });

        it('should set billing countries value based on edit Data', () => {
            expect(component.state.billingCountries).toEqual(getStateData.editData[FormsUtils.FORMS.CHECKOUT.BILLING_COUNTRIES_LIST]);
        });

        it('should get country list from API if editData for billing countries is not available', () => {
            getStateStub.and.returnValue({ editData: {} });
            isGuestOrderStub.and.returnValue(false);
            component.componentDidMount();
            expect(getCountryListStub).toHaveBeenCalledTimes(1);
        });

        it('should set billingCountries with the data of getCountryList API', () => {
            getStateStub.and.returnValue({ editData: {} });
            isGuestOrderStub.and.returnValue(false);
            component.componentDidMount();
            expect(component.state.billingCountries).toEqual(billingCountriesData);
        });

        it('should set billingCountries API data onto store', () => {
            getStateStub.and.returnValue({ editData: {} });
            isGuestOrderStub.and.returnValue(false);
            component.componentDidMount();
            expect(updateEditDataStub).toHaveBeenCalledWith(billingCountriesData, FormsUtils.FORMS.CHECKOUT.BILLING_COUNTRIES_LIST);
        });

        it('should get showError method from PaymentSection mixin', () => {
            expect(component.showError).toBeTruthy();
        });
    });
});
