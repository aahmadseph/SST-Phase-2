export default function getResource(label, vars = []) {
    const resources = {
        loves: 'Favoris',
        viewAllLovesAddList1: 'Visionnez tous vos articles favoris ici en',
        viewAllLovesAddList2: 'les ajoutant à votre liste de Favoris.'
    };
    return resources[label];
}
