import React from 'react';
import store from 'Store';
import { render, screen } from 'test-utils';

import SignInWithMessagingModal from 'components/GlobalModals/SignInWithMessagingModal/SignInWithMessagingModal.ctrlr';
import pageState from '__mocks__/pageData/happening/services/booking/8700001.json';

describe('containsRestrictedItem', () => {
    let getStateStub;
    let state;

    beforeEach(() => {
        state = window.structuredClone(pageState);
        getStateStub = jest.spyOn(store, 'getState');
    });

    const setupStateWithBIPoints = points => {
        state.basket.potentialBeautyBankPoints = points;
        getStateStub.mockReturnValue(state);
    };

    test('should render the SignInWithMessagingModal component correctly', () => {
        setupStateWithBIPoints(0);
        const { getByText } = render(<SignInWithMessagingModal isOpen={true} />, { redux: state });
        expect(getByText('Want to Save Your 0 Points?')).toBeInTheDocument();
        expect(screen.getByTestId('guest-checkout-messaging')).toBeInTheDocument();
    });

    test('should render GuestBookingMessaging when isGuestBookingEnabled is true', () => {
        setupStateWithBIPoints(200);
        const { getByText } = render(
            <SignInWithMessagingModal
                isOpen={true}
                isGuestBookingEnabled={true}
                potentialServiceBIPoints={150}
            />,
            { redux: state }
        );

        expect(getByText('Want to Save Your 150 Points?')).toBeInTheDocument();
        expect(screen.getByTestId('guest-booking-messaging')).toBeInTheDocument();
    });

    test('should render GuestCheckoutMessaging when isGuestBookingEnabled is false', () => {
        setupStateWithBIPoints(200);
        const { getByText } = render(
            <SignInWithMessagingModal
                isOpen={true}
                isGuestBookingEnabled={false}
                potentialServiceBIPoints={100}
            />,
            { redux: state }
        );

        expect(getByText('Want to Save Your 200 Points?')).toBeInTheDocument();
        expect(screen.getByTestId('guest-checkout-messaging')).toBeInTheDocument();
    });
});
