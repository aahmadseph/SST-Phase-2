export default function getResource(label, vars = []) {
    const resources = {
        deleteList: 'Supprimer la liste',
        deleteText: 'Voulez-vous vraiment supprimer cette liste? Une fois supprimée, toute personne avec laquelle vous l’avez partagée ne pourra plus y accéder.',
        yesDeleteList: 'Oui, supprimer ma liste',
        noKeepList: 'Non, conserver ma liste'
    };

    return resources[label];
}
