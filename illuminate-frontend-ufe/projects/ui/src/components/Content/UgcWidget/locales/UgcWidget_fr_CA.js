export default function getResource(label) {
    const resources = {
        seeItInRealLife: 'Détails de la photo',
        mentionSephora: 'Mentionnez @sephora pour courir la chance d’être en vedette ou téléversez votre photo dans la galerie.',
        addYourPhoto: '+ ajoutez votre photo'
    };
    return resources[label];
}
