const resources = {
    firstNameLabel: 'Prénom',
    lastNameLabel: 'Nom de famille',
    productAsSampleLabel: 'J’ai reçu ce produit en échantillon gratuit',
    noteLabel: 'Remarque',
    reviewLabel: 'Commentaire',
    yesLabel: 'Oui',
    noLabel: 'Non',
    sephoraEmployeeLabel: 'Je suis un employé de Sephora',
    nextLabel: 'Suivant',
    submitErrorLabel: 'Erreur de soumission',
    thankYouLabel: 'Merci',
    addPromoLabel: 'Ajouter un code promotionnel',
    seeMoreLabel: 'Voir plus',
    shopNowLabel: 'Magasiner',
    videoLabel: 'Vidéo',
    sorrySomethingWrongLabel: 'Nous sommes désolés, une erreur s’est produite. Veuillez essayer de nouveau.'
};

export default function getResource(label) {
    return resources[label];
}
