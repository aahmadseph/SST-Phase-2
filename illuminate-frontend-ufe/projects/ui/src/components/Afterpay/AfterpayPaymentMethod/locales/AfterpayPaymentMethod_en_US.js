export default function getResource(label, vars = []) {
    const resources = {
        widgetError: `Trouble connecting to ${vars[0]}. Please use a different payment method or try again later.`,
        legalNotice: `By clicking Continue to ${vars[0]}, I am instructing Sephora \
to send my order and billing information to Afterpay and understand that \
information will be subject to Afterpay's \
<a href='${vars[1]}' target='_blank'>terms</a> and \
<a href='${vars[2]}' target='_blank'>privacy policy</a>.`
    };

    return resources[label];
}
