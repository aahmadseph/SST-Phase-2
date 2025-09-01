import { createSelector } from 'reselect';

// Selector to get the tax claim state
const taxClaimSelector = state => state.page.taxClaim || {};

// Selector to extract taxFormSubmitSuccess and taxFormSubmitError
const taxSubmitResponseSelector = createSelector(taxClaimSelector, taxClaim => ({
    taxFormSubmitSuccess: taxClaim.taxFormSubmitSuccess,
    taxFormSubmitError: taxClaim.taxFormSubmitError
}));

export default taxSubmitResponseSelector;
