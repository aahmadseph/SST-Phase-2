export default function getResource(label, vars = []) {
    const resources = {
        title: 'Pas encore de réservation? Changeons cela!',
        description: 'Découvrez nos services et événements pour découvrir un large éventail d’offres dans les magasins les plus près. Réservez votre premier service dès aujourd’hui et ne manquez pas nos événements à venir!',
        button: 'Découvrir les services et les événements'
    };

    return resources[label];
}
