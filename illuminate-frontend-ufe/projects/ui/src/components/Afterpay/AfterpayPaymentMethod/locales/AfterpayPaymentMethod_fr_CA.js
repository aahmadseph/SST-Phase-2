export default function getResource(label, vars = []) {
    const resources = {
        widgetError: `Difficulté à se connecter à ${vars[0]}. Veuillez utiliser un autre mode de paiement ou réessayer plus tard.`,
        legalNotice: `By clicking Continue to ${vars[0]}, I am instructing Sephora \
to send my order and billing information to Afterpay and understand that \
information will be subject to Afterpay's \
<a href='${vars[1]}' target='_blank'>terms</a> and \
<a href='${vars[2]}' target='_blank'>privacy policy</a>.`
    };

    return resources[label];
}
