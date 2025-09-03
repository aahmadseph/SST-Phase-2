export default function getResource(label, vars = []) {
    const resources = {
        free: 'GRATUIT',
        edit: 'Modifier',
        eyes: 'Yeux',
        eyebrows: 'Sourcils',
        complexion: 'Teint',
        cheeks: 'Joues',
        lips: 'Lèvres',
        selectOneFeature: 'Choisissez une caractéristique sur laquelle vous concentrer :',
        optional: '(facultatif)',
        anySpecialRequests: 'Avez-vous des demandes spéciales?',
        shareYourIdeas: 'Partagez vos idées, marques préférées ou produits. Vous pouvez toujours changer d’avis le jour de votre rendez-vous.'
    };

    return resources[label];
}
