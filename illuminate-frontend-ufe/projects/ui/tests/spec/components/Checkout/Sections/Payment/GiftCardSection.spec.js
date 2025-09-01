/* eslint-disable object-curly-newline */
const { createSpy, objectContaining } = jasmine;
const { shallow, mount } = require('enzyme');
const { UPDATE_ORDER, TOGGLE_PLACE_ORDER } = require('constants/actionTypes/order');
const React = require('react');

describe('GiftCardSection component', () => {
    let store;
    let decorators;
    let GiftCardSection;

    beforeEach(() => {
        store = require('Store').default;
        decorators = require('utils/decorators').default;
        GiftCardSection = require('components/Checkout/Sections/Payment/GiftCardSection/GiftCardSection').default;
    });

    xit('should hide the form on Payment Section', () => {
        // Arrange
        const wrapper = mount(<GiftCardSection />);
        const component = wrapper.instance();
        component.giftCardForm = { clearForm: () => {} };

        // Act
        component.hideForm();

        // Assert
        expect(wrapper.state()).toEqual(objectContaining({ showForm: false }));
    });

    xit('should reset the form state', () => {
        // Arrange
        const wrapper = mount(<GiftCardSection />);
        const component = wrapper.instance();
        const clearForm = createSpy('clearForm');
        component.giftCardForm = { clearForm };

        // Act
        component.hideForm();

        // Assert
        expect(clearForm).toHaveBeenCalled();
    });

    it('should dispatch "UPDATE_ORDER" action when updateOrder function is invoked', () => {
        // Arrange
        const action = { type: UPDATE_ORDER };
        const dispatch = spyOn(store, 'dispatch');
        const resolvedPromise = Promise.resolve({});
        spyOn(decorators, 'withInterstice').and.returnValue(() => resolvedPromise);

        // Act
        shallow(<GiftCardSection />)
            .instance()
            .updateOrder();

        // Assert
        return resolvedPromise.then(() => {
            expect(dispatch).toHaveBeenCalledWith(objectContaining(action));
        });
    });

    it('should dispatch "TOGGLE_PLACE_ORDER" action when updateOrder function is invoked', () => {
        // Arrange
        const action = { type: TOGGLE_PLACE_ORDER };
        const initialState = store.getState();
        spyOn(store, 'getState').and.callFake(() => ({
            ...initialState,
            order: {
                ...initialState.order,
                isPlaceOrderDisabled: true
            }
        }));
        const dispatch = spyOn(store, 'dispatch');
        const resolvedPromise = Promise.resolve({});
        spyOn(decorators, 'withInterstice').and.returnValue(() => resolvedPromise);

        // Act
        shallow(<GiftCardSection />)
            .instance()
            .updateOrder();

        // Assert
        return resolvedPromise.then(() => {
            expect(dispatch).toHaveBeenCalledWith(objectContaining(action));
        });
    });

    it('should not dispatch "TOGGLE_PLACE_ORDER" action when updateOrder function is invoked', () => {
        // Arrange
        const action = { type: TOGGLE_PLACE_ORDER };
        const initialState = store.getState();
        spyOn(store, 'getState').and.callFake(() => ({
            ...initialState,
            order: {
                ...initialState.order,
                isPlaceOrderDisabled: false
            }
        }));
        const dispatch = spyOn(store, 'dispatch');
        const resolvedPromise = Promise.resolve({});
        spyOn(decorators, 'withInterstice').and.returnValue(() => resolvedPromise);

        // Act
        shallow(<GiftCardSection />)
            .instance()
            .updateOrder();

        // Assert
        return resolvedPromise.then(() => {
            expect(dispatch).not.toHaveBeenCalledWith(objectContaining(action));
        });
    });
});
