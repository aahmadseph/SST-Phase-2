export default function getResource(label, vars = []) {
    const resources = {
        tooltipText: 'Les préférences beauté vous permettent de sauvegarder vos traits (comme le type de peau et de cheveux) et vos préférences d’achat, afin que vous puissiez facilement trier les produits et personnaliser votre expérience sur le site.',
        moreInfo: 'Plus d’information'
    };
    return resources[label];
}
