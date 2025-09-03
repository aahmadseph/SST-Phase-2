import React from 'react';
import store from 'store/Store';
import { render } from 'test-utils';

import SignInModal from 'components/GlobalModals/SignInModal/SignInModal.ctrlr.jsx';
import pageState from '__mocks__/pageData/happening/services/booking/8700001.json';

describe('containsRestrictedItem', () => {
    let getStateStub;
    let state;
    let email;
    const ssrData = 'FREE standard shipping';
    const potentialBiPoints = 123;
    const ssrDataWithPoints = '123 Beauty Insider points';

    beforeEach(() => {
        state = window.structuredClone(pageState);
        getStateStub = jest.spyOn(store, 'getState');
        email = 'email@email.com';
    });

    const setupStateWithBIPoints = points => {
        state.basket.potentialBeautyBankPoints = points;
        getStateStub.mockReturnValue(state);
    };

    test('should render the SignInModal component correctly', () => {
        setupStateWithBIPoints(0);
        const { queryByText, getByText } = render(
            <SignInModal
                isOpen={true}
                email={email}
            />,
            { redux: state }
        );
        expect(queryByText('Want to Save Your')).not.toBeInTheDocument();
        expect(queryByText('0 Beauty Insider points')).not.toBeInTheDocument();
        expect(getByText(ssrData)).toBeInTheDocument();
    });

    test('should render the SignInModal component correctly without potentialBiPoints', () => {
        setupStateWithBIPoints(0);
        const { queryByText } = render(
            <SignInModal
                isOpen={true}
                email={email}
                extraParams={{
                    potentialBiPoints: 0
                }}
            />,
            { redux: state }
        );
        expect(queryByText('Want to Save Your 0 Points?')).not.toBeInTheDocument();
        expect(queryByText('0 Beauty Insider points')).not.toBeInTheDocument();
        expect(queryByText(ssrData)).toBeInTheDocument();
    });

    test('should render the SignInModal component correctly with potentialBiPoints', () => {
        setupStateWithBIPoints(0);
        const { queryByText, getByText } = render(
            <SignInModal
                isOpen={true}
                email={email}
                extraParams={{ potentialBiPoints }}
            />,
            { redux: state }
        );
        expect(queryByText('Want to Save Your 123 Points?')).toBeInTheDocument();
        expect(getByText(ssrDataWithPoints)).toBeInTheDocument();
        expect(queryByText(ssrData)).not.toBeInTheDocument();
    });

    test('should render the SignInModal component WITH option for Create Account', () => {
        setupStateWithBIPoints(0);
        const { getByText } = render(
            <SignInModal
                isOpen={true}
                email={email}
                extraParams={{
                    showOptionToCreateAccount: true
                }}
            />,
            { redux: state }
        );

        expect(getByText('Create Account')).toBeInTheDocument();
    });

    test('should render the SignInModal component WITHOUT option for Create Account', () => {
        setupStateWithBIPoints(0);
        const { queryByText } = render(
            <SignInModal
                isOpen={true}
                email={email}
                extraParams={{
                    showOptionToCreateAccount: false
                }}
            />,
            { redux: state }
        );
        expect(queryByText('Create Account')).not.toBeInTheDocument();
    });

    test('should render the SignInModal component WITH option for Create Account WHEN no showOptionToCreateAccount extraParams is provided', () => {
        setupStateWithBIPoints(0);
        const { getByText } = render(
            <SignInModal
                isOpen={true}
                email={email}
            />,
            { redux: state }
        );

        expect(getByText('Create Account')).toBeInTheDocument();
    });
});
