export default function getResource(label) {
    const resources = {
        sduMemberFeeUS: 'En tant que membre de la livraison illimitée le jour même, vous économisez 6,95 $ sur les frais de livraison le jour même.',
        sduMemberFeeCA: 'En tant que membre de la livraison illimitée le jour même, vous économisez 9,95 $ sur les frais de livraison le jour même.',
        sduScheduledFeeUS: 'Les frais de livraison le jour même sont de 9,95 $.',
        sduScheduledFeeCA: 'Les frais de livraison le jour même sont de 12,95 $.'
    };

    return resources[label];
}
