export default function getResource(label, vars = []) {
    const resources = {
        myBillingAddrIsTheSame: 'My billing address is the same as my shipping address',
        iframeError: 'Trouble connecting to Klarna. Please use a different payment method or try again later.',
        legalNotice: 'By clicking Continue to Klarna, I am instructing Sephora to send my order and billing information to Klarna and understand that information will be subject to the Klarna terms and the Klarna privacy policy.'
    };

    return resources[label];
}
