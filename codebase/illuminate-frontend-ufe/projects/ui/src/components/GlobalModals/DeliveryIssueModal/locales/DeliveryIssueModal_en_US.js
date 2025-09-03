export default function getResource(label, vars = []) {
    const resources = {
        orderIssue: 'Report Issue',
        pleaseSelect: 'Select the reason that applies to your order:',
        continue: 'Continue',
        cancel: 'Cancel',
        goToCustomerService: 'Contact Customer Service',
        weAreHereToHelp: 'We’re Here to Help!',
        selectOne: 'Select one of the following options.',
        requestRefund: 'Request a Refund',
        pleaseContact: 'Please contact Customer Service to request a refund for this order.',
        requestReplacement: 'Request a Replacement',
        replaceOrder: 'Replace Order',
        weProvideReplacement: 'We provide a one-time replacement for your order at no charge to you! The delivery will be the same as your original order. All replacement requests are subject to review.',
        pleaseReachOut: 'Please reach out to Customer Service for assistance on your order.',
        pleaseMakeSelection: 'Please make a selection.',
        somethingWrong: 'Sorry! Something went wrong.',
        please: 'Please ',
        contactCustomerService: 'Contact Customer Service',
        orTryLater: ' or try again later.'
    };

    return resources[label];
}
