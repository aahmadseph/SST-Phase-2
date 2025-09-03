export default function getResource(label, vars = []) {
    const resources = {
        reservationPolicies: 'Reservation Policies',
        cancelationPolicyLabel: 'Cancellation Policy',
        cancelationPolicy: 'You may cancel or reschedule your appointment up to 24 hours before the service.',
        lateCancelOrNoShowFeeLabel: 'Late Cancel or No-Show Fee',
        lateCancelOrNoShowFee: `A credit card is required to hold this reservation. If you cancel within 24 hours of the service or if you do not show, you will be charged ${vars[0]}.`,
        paymentLabel: 'Payment',
        payment: `The full payment of ${vars[0]} plus applicable taxes will be charged at the time of service using the payment method used to hold the reservation. You will receive an email confirmation when your payment has been processed. Payment does not count toward product purchase.`,
        paymentShort: `The full payment of ${vars[0]} plus applicable taxes will be charged at the time of service. You may choose to redeem a gift card in-store at the time of payment.`,
        complementaryPayment: 'Complimentary with a minimum $50 purchase in-store on the same day as the appointment.',
        virtual: 'Virtual',
        onTimeLabel: 'On-Time Policy',
        onTimeText: 'Don’t be late! Be respectful of our Beauty Advisor’s time. Late arrivals risk losing their appointments.',
        telephoneUseAuthorization: 'I authorize Sephora to use automatic telephone dialing systems to send text messages to my cellphone concerning my appointment. I understand that I am not required to agree to receive these messages as a condition of purchasing any property, goods, or services.',
        telephoneUseAuthorizationEDP: `I authorize Sephora to use autodialed text messages regarding my appointment. Consent is not a condition of purchase.  Message & data rates may apply. Terms: ${vars[0]}`,
        scheduleAppointment: `If you would like to schedule an appointment more than 90 days in advance, please call your preferred ${vars[0]}.`,
        store: 'store',
        genericErrorMessage: 'Oops! Our online reservation system is temporarily unavailable. Please try again later.',
        genericPaymentMessage: 'We could not process your credit card. Please review the card information and try again, or try another card.'
    };

    return resources[label];
}
