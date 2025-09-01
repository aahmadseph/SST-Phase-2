module.exports = function getResource(label, vars = []) {
    const resources = {
        unsubscribeModalConfirmTitle: 'Désabonné',
        unsubscribeModalConfirmMsg: 'Vous avez réussi à vous désabonner de votre article à réapprovisionnement automatique.',
        unsubscribeModalConfirmButtonText: 'Terminé',
        errorMessage: 'Oups! Un problème est survenu et nous n’avons pas été en mesure de traiter vos modifications. Veuillez réessayer plus tard.',
        manageSubscription: 'Gérer l’abonnement',
        unsubscribeItem: 'Se désabonner de l’article',
        updateSubscriptionError: 'Mettre à jour l’abonnement',
        pausedSubscriptionModalConfirmTitle: 'Article en pause',
        pausedSubscriptionModalConfirmMsg: 'Le réapprovisionnement automatique de cet article a été mis en pause. Vous pouvez sélectionner « Reprendre » à tout moment pour reprendre la livraison.',
        pausedSubscriptionModalConfirmButtonText: 'Terminé',
        skipItemUnavailable: '« Sauter l’article » n’est pas disponible',
        skipedSubscriptionModalConfirmTitle: 'Article sauté',
        nextShipmentText: 'Le réapprovisionnement automatique de votre article sautera la prochaine livraison et reprendra le',
        pause: 'En pause',
        getItSoonerUpdateTitle: 'Mise à jour de l’abonnement Obtenez-le plus rapidement',
        getItSoonerConfirmationTitle: 'Article ajouté au panier',
        getItSoonerConfirmationContent: 'L’article a été ajouté à votre panier. Vous serez maintenant dirigé vers votre panier',
        getItSoonerConfirmButtonText: 'Terminé',
        resumeItem: 'Reprendre l’article',
        deleteCard: 'Supprimer la carte',
        addNewCard: 'Ajoutez une nouvelle carte de crédit ou de débit',
        editCard: 'Modifier la carte de crédit ou de débit',
        pauseItem: 'Mettre l’article en pause'
    };
    return resources[label];
};
