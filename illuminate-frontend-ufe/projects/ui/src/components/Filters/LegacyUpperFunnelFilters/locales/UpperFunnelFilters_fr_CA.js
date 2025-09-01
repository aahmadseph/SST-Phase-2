export default function getResource(label, vars = []) {
    const resources = {
        chooseStore: 'Choisir un magasin',
        setYourLocation: 'Définir votre emplacement',
        pickup: 'Ramassage',
        reset: 'Réinitialiser'
    };

    return resources[label];
}
