export default function getResource(label, vars = []) {
    const common = {
        privacyPolicy: 'Privacy Policy',
        andConditionsOfUse: 'Conditions of Use, have read the ',
        noticeOfFinancialIncentive: 'Notice of Financial Incentive.',
        noShippingAddressRequired: 'No shipping address or payment is required for this order. Please review your information before placing your order.',
        noPaymentRequired: 'No payment is required for this order. Please review your information before placing your order.',
        pleaseReviewOrder: `Please review your order information before ${vars[0]}`,
        termsConditions: 'Terms & Conditions',
        andText: ' and ',
        verifyCVV: 'No payment is required, please verify your CVV/CVC number for security purposes. Please review your information before placing your order.',
        verifyCVVeFulfilledOrder: 'No shipping address or payment is required for this order. CVV/CVC is required for security purposes only. Please review your information before placing your order.',
        pleaseReviewOrderInfoText: 'Please review your order information before placing your order.',
        byPlacingOrderCaText: 'By placing your order, you agree to be bound by the ',
        termsOfPurchase: 'Terms of Purchase',
        termsOfUse: 'Terms of Use',
        iAgreeToSephora: 'I Agree to Sephora’s ',
        termsAndConditions: 'Terms & Conditions ',
        termsOfService: 'Terms of Service '
    };

    let resources = {};

    if (Sephora.isAgent) {
        resources = {
            ...common,
            forTheSubscription: ' for the subscription and authorize Sephora to charge your default payment method or another payment method on file. Your subscription continues until canceled. You acknowledge you can cancel at any time via the Auto-Replenish page in My Account.',
            byClickingPlaceOrder: 'By clicking Place Order button, you also agree to Sephora’s ',
            iAgreeToAutoReplenish: 'You Agree to the Auto-Replenish ',
            andConditionsOfUseHaveRead: 'Conditions of Use, and have read the '
        };
    } else {
        resources = {
            ...common,
            forTheSubscription: ' for the subscription and authorize Sephora to charge my default payment method or another payment method on file. My subscription continues until canceled. I acknowledge I can cancel at any time via the Auto-Replenish page in My Account.',
            byClickingPlaceOrder: 'By clicking Place Order button, I also agree to Sephora’s ',
            iAgreeToAutoReplenish: 'I Agree to the Auto-Replenish ',
            andConditionsOfUseHaveRead: 'Conditions of Use, and have read the '
        };
    }

    return resources[label];
}
