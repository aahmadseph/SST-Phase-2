export default function getResource(label, vars = []) {
    const resources = {
        titleNewUser: 'Erreur lors de la création du compte',
        title: 'Mise à jour de l’adresse courriel',
        message: `L’adresse courriel <b>${vars[0]}</b> est-elle correcte?`,
        ok: 'Oui, continuer',
        cancel: 'Non, modifier l’adresse courriel'
    };

    return resources[label];
}
