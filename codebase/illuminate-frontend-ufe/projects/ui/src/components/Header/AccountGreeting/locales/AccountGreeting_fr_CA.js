const resources = {
    lead: 'Ouvrez une session pour profiter de la *livraison standard GRATUITE* sur toutes les commandes.',
    signIn: 'Ouvrir une session',
    createAccount: 'Créer un compte'
};

export default function getResource(label) {
    return resources[label];
}
