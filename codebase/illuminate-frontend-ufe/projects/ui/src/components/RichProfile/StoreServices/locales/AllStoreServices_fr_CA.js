export default function getResource(label, vars = []) {
    const resources = {
        inStoreServices: 'Services en magasin',
        showMore: 'Afficher plus',
        signInToSee: 'Vous devez ouvrir une session pour consulter cette page.',
        signIn: 'Ouvrir une session'
    };

    return resources[label];
}
