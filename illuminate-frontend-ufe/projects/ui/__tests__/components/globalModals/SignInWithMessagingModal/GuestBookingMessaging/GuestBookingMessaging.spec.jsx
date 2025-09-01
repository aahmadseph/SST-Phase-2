import { render } from 'test-utils';
import GuestBookingMessaging from 'components/GlobalModals/SignInWithMessagingModal/GuestBookingMessaging';
import pageState from '__mocks__/pageData/happening/services/booking/8700001.json';

describe('GuestBookingMessaging component', () => {
    let state;

    beforeEach(() => {
        state = window.structuredClone(pageState);
    });

    describe('WHEN there are BI points', () => {
        test('THEN it SHOULD render the correct text for BI points in the modal', () => {
            // Act
            const { getByText } = render(<GuestBookingMessaging potentialBiPoints={100} />, { redux: state });
            // Assert
            expect(getByText('Create an Account')).toBeInTheDocument();
            expect(getByText('100 points')).toBeInTheDocument();
        });
    });

    describe('WHEN there are NO BI points', () => {
        test('THEN it SHOULD render the correct text for NO BI points in the modal', () => {
            // Act
            const { getByText } = render(<GuestBookingMessaging potentialBiPoints={undefined} />, { redux: state });

            // Assert
            expect(getByText('Create an Account')).toBeInTheDocument();
            expect(getByText('0 points')).toBeInTheDocument();
        });
    });

    describe('WHEN actions are available', () => {
        test('THEN it SHOULD render button for "Continue as a Guest" and "Create Account"', () => {
            // Act
            const { getByText } = render(<GuestBookingMessaging />, { redux: state });

            // Assert
            expect(getByText('Continue as a Guest')).toBeInTheDocument();
            expect(getByText('Create Account')).toBeInTheDocument();
        });
    });
});
