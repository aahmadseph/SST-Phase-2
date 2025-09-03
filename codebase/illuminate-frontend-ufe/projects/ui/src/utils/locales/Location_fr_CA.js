export default function getResource(label, vars = []) {
    const resources = {
        basket: 'Panier',
        brandsList: 'Liste des marques Sephora',
        lists: 'Listes',
        lovesList: 'Liste de favoris',
        purchaseHistory: 'Historique des achats',
        inStoreServices: 'Services en magasin',
        writeAReview: 'Rédiger un commentaire',
        orderConfirmation: 'Confirmation de la commande',
        orderDetail: 'Détails de la commande',
        profile: 'Profil',
        beautyInsider: 'Beauty Insider',
        myAccount: 'Mon compte',
        recentOrders: 'Commandes récentes',
        subscriptions: 'Abonnements',
        autoReplenishment: 'Réapprovisionnement automatique',
        reservations: 'Réservations',
        savedAddresses: 'Adresses enregistrées',
        paymentsAndCredits: 'Paiements et crédits',
        emailAndMailPreferences: 'Courriel et préférences',
        beautyForum: 'Forum beauté | Collectivité Sephora',
        gallery: 'Galerie | Collectivité Sephora',
        addPhoto: 'Ajouter une photo | Collectivité Sephora',
        sitemapDepartments: 'Plan du site des rayons Beauté',
        beautyPreferences: 'Préférences beauté'
    };

    return resources[label];
}
