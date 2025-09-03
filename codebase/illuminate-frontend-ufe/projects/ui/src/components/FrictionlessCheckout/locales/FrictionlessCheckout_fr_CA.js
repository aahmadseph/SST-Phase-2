const resources = {
    bopisTitle: 'Paiement de la commande « Achetez en ligne, ramassez en magasin »',
    sadTitle: 'Paiement de l’expédition et de la livraison'
};

export default function getResource(label) {
    return resources[label];
}
