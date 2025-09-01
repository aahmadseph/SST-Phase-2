/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');
const { any } = jasmine;

describe('PaymentSectionExistingUser component', () => {
    const PayPal = require('utils/PayPal').default;
    const PaymentSectionExistingUser =
        require('components/Checkout/Sections/Payment/Section/PaymentSectionExistingUser/PaymentSectionExistingUser').default;
    const store = require('Store').default;
    const utilityApi = require('services/api/utility').default;
    const EditDataActions = require('actions/EditDataActions').default;
    const FormsUtils = require('utils/Forms').default;

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
                user: {}
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
            props = {
                creditCardPaymentGroup: {},
                isPayPalEnabled: true
            };
            const wrapper = shallow(<PaymentSectionExistingUser {...props} />);
            component = wrapper.instance();
            setNewCreditCardStub = spyOn(component, 'setNewCreditCard');
        });

        it('should set new credit card data if available', function () {
            component.componentDidMount();
            expect(setNewCreditCardStub).toHaveBeenCalledWith(props.creditCardPaymentGroup);
        });

        it('should watch for order details for Mobile', () => {
            // Arrange
            store.setAndWatch = setAndWatch;
            setAndWatchStub = spyOn(store, 'setAndWatch');
            spyOn(Sephora, 'isMobile').and.returnValue(true);

            // Act
            const wrapper = shallow(<PaymentSectionExistingUser {...props} />);
            component = wrapper.instance();
            component.componentDidMount();

            // Assert
            expect(setAndWatchStub).toHaveBeenCalledWith('order.orderDetails', component, any(Function));
        });

        it('should set and watch for order price info', () => {
            // Arrange
            store.setAndWatch = setAndWatch;
            setAndWatchStub = spyOn(store, 'setAndWatch');

            // Act
            const wrapper = shallow(<PaymentSectionExistingUser {...props} />);

            // Assert
            component = wrapper.instance();
            expect(setAndWatchStub).toHaveBeenCalledWith('order.orderDetails.priceInfo', component, any(Function));
        });

        it('should prepare paypal checkout', () => {
            const priceInfoWatcherCallback = setAndWatchStub.calls.first().args[2];
            priceInfoWatcherCallback();
            expect(preparePaypalCheckoutStub).toHaveBeenCalledTimes(1);
        });

        it('should set billing countries value based on edit Data', function () {
            expect(component.state.billingCountries).toEqual(getStateData.editData[FormsUtils.FORMS.CHECKOUT.BILLING_COUNTRIES_LIST]);
        });

        it('should get country list from API if editData for billing countries is not available', function () {
            getStateStub.and.returnValue({
                editData: {},
                user: {}
            });
            component.componentDidMount();
            expect(getCountryListStub).toHaveBeenCalledTimes(1);
        });

        it('should set billingCountries with the data of getCountryList API', function () {
            getStateStub.and.returnValue({
                editData: {},
                user: {}
            });
            component.componentDidMount();
            expect(component.state.billingCountries).toEqual(billingCountriesData);
        });

        it('should set billingCountries API data onto store', function () {
            getStateStub.and.returnValue({
                editData: {},
                user: {}
            });
            component.componentDidMount();
            expect(updateEditDataStub).toHaveBeenCalledWith(billingCountriesData, FormsUtils.FORMS.CHECKOUT.BILLING_COUNTRIES_LIST);
        });

        it('should set and watch for apple pay', function () {
            expect(setAndWatchStub).toHaveBeenCalledWith('order.isApplePayFlow', component, null, true);
        });

        it('should get showError method from PaymentSection mixin', function () {
            expect(component.showError).toBeTruthy();
        });
    });
});
