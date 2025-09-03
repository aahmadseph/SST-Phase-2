// Mock module for Storybook - provides empty implementations for external dependencies

// Universal mock that can handle any property access
const universalMock = new Proxy(() => {}, {
    get: () => universalMock,
    apply: () => universalMock,
    construct: () => universalMock
});

// Default export
export default universalMock;

// Named exports for common cases
export const BraintreeClient = universalMock;

export const BraintreeVenmo = universalMock;

export const BraintreePayPal = universalMock;

export const NProgressBarLib = universalMock;

export const braintree = universalMock;

export const venmo = universalMock;

export const client = universalMock;

export const dataCollector = universalMock;

export const confetti = universalMock;

export const frt = universalMock;
