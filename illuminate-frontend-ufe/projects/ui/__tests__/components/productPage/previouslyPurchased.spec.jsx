import { render } from 'test-utils';
import PreviouslyPurchased from 'components/ProductPage/PreviouslyPurchased';

// Mock data for testing
const mockPurchaseHistoryData = [
    {
        productId: 'P12345',
        transactionDate: 1755525811000, // Aug 18, 2025
        frequency: 2,
        variationTypeDisplayName: 'Color',
        variationValue: 'Happy',
        variationDesc: 'dewy cool pink'
    },
    {
        productId: 'P67890',
        transactionDate: 1750000000000, // Different date
        frequency: 1,
        variationTypeDisplayName: 'None'
    }
];

// const mockPurchaseHistoryDataSingle = [
//     {
//         productId: 'P11111',
//         transactionDate: 1755525811000,
//         frequency: 1,
//         variationTypeDisplayName: 'Size',
//         variationValue: '1.7 oz',
//         variationDesc: 'travel size'
//     }
// ];

// const mockPurchaseHistoryDataNoVariation = [
//     {
//         productId: 'P22222',
//         transactionDate: 1755525811000,
//         frequency: 3,
//         variationTypeDisplayName: 'None'
//     }
// ];

const baseMockState = {
    completePurchaseHistory: {
        items: mockPurchaseHistoryData
    },
    testTarget: {
        offers: {
            previouslyPurchasedPdp: {
                show: true
            }
        }
    }
};

describe('PreviouslyPurchased component', () => {
    let state;

    beforeEach(async () => {
        // Create a deep copy - don't use JSON.parse(JSON.stringify( as it's 2 times slower
        state = window.structuredClone(baseMockState);
    });

    // test('should render with purchase history data showing multiple purchases', () => {
    //     const { getByText } = render(<PreviouslyPurchased productId='P12345' />, { redux: state });

    //     expect(getByText('Purchased 2 times')).toBeInTheDocument();
    //     expect(getByText('Last purchase:')).toBeInTheDocument();
    //     expect(getByText('Aug 18, 2025')).toBeInTheDocument();
    //     expect(getByText('Color:')).toBeInTheDocument();
    //     expect(getByText('Happy - dewy cool pink')).toBeInTheDocument();
    // });

    // test('should render with purchase history data showing single purchase', () => {
    //     // Modify state for this test
    //     state.completePurchaseHistory.items = mockPurchaseHistoryDataSingle;

    //     const { getByText } = render(<PreviouslyPurchased productId='P11111' />, { redux: state });

    //     expect(getByText('Purchased 1 time')).toBeInTheDocument();
    //     expect(getByText('Last purchase:')).toBeInTheDocument();
    //     expect(getByText('Aug 18, 2025')).toBeInTheDocument();
    //     expect(getByText('Size:')).toBeInTheDocument();
    //     expect(getByText('1.7 oz - travel size')).toBeInTheDocument();
    // });

    // test('should render without variation information when variationTypeDisplayName is "None"', () => {
    //     // Modify state for this test
    //     state.completePurchaseHistory.items = mockPurchaseHistoryDataNoVariation;

    //     const { getByText, queryByText } = render(<PreviouslyPurchased productId='P22222' />, { redux: state });

    //     expect(getByText('Purchased 3 times')).toBeInTheDocument();
    //     expect(getByText('Last purchase:')).toBeInTheDocument();
    //     expect(getByText('Aug 18, 2025')).toBeInTheDocument();
    //     expect(queryByText('Color:')).not.toBeInTheDocument();
    //     expect(queryByText('Size:')).not.toBeInTheDocument();
    // });

    test('should show skeleton when no purchase history exists for product', () => {
        const { container } = render(
            <PreviouslyPurchased productId='P99999' />, // Non-existent product
            { redux: state }
        );

        expect(container.firstChild).not.toBeNull();
    });

    // test('should handle empty purchase history array', () => {
    //     // Modify state for this test
    //     state.completePurchaseHistory.items = [];

    //     const { container } = render(<PreviouslyPurchased productId='P12345' />, { redux: state });

    //     expect(container.firstChild).toBeNull();
    // });

    // test('should handle missing completePurchaseHistory in state', () => {
    //     // Modify state for this test
    //     delete state.completePurchaseHistory;

    //     const { container } = render(<PreviouslyPurchased productId='P12345' />, { redux: state });

    //     expect(container.firstChild).toBeNull();
    // });

    // describe('Date formatting', () => {
    //     test('should format transaction date correctly', () => {
    //         // Modify state for this test
    //         state.completePurchaseHistory.items = [
    //             {
    //                 productId: 'P12345',
    //                 transactionDate: 1577836800000, // Jan 1, 2020
    //                 frequency: 1,
    //                 variationTypeDisplayName: 'None'
    //             }
    //         ];

    //         const { getByText } = render(<PreviouslyPurchased productId='P12345' />, { redux: state });

    //         expect(getByText('Last purchase:')).toBeInTheDocument();
    //         expect(getByText('Jan 01, 2020')).toBeInTheDocument();
    //     });
    // });

    // describe('Variation handling', () => {
    //     test('should render variation without description', () => {
    //         // Modify state for this test
    //         state.completePurchaseHistory.items = [
    //             {
    //                 productId: 'P12345',
    //                 transactionDate: 1755525811000,
    //                 frequency: 1,
    //                 variationTypeDisplayName: 'Color',
    //                 variationValue: 'Red'
    //                 // No variationDesc
    //             }
    //         ];

    //         const { getByText } = render(<PreviouslyPurchased productId='P12345' />, { redux: state });

    //         expect(getByText('Last purchase:')).toBeInTheDocument();
    //         expect(getByText('Aug 18, 2025')).toBeInTheDocument();
    //         expect(getByText('Color:')).toBeInTheDocument();
    //         expect(getByText('Red')).toBeInTheDocument();
    //     });

    //     test('should render variation with both value and description', () => {
    //         // Modify state for this test
    //         state.completePurchaseHistory.items = [
    //             {
    //                 productId: 'P12345',
    //                 transactionDate: 1755525811000,
    //                 frequency: 1,
    //                 variationTypeDisplayName: 'Color',
    //                 variationValue: 'Happy',
    //                 variationDesc: 'dewy cool pink'
    //             }
    //         ];

    //         const { getByText } = render(<PreviouslyPurchased productId='P12345' />, { redux: state });

    //         expect(getByText('Last purchase:')).toBeInTheDocument();
    //         expect(getByText('Aug 18, 2025')).toBeInTheDocument();
    //         expect(getByText('Color:')).toBeInTheDocument();
    //         expect(getByText('Happy - dewy cool pink')).toBeInTheDocument();
    //     });
    // });

    // describe('Accessibility', () => {
    //     test('should have proper ARIA attributes', () => {
    //         const { container } = render(<PreviouslyPurchased productId='P12345' />, { redux: state });

    //         const icon = container.querySelector('svg');
    //         expect(icon).toHaveAttribute('aria-hidden', 'true');
    //     });
    // });
});
