export default function getResource(label, vars = []) {
    const resources = {
        allText: ' Tous',
        unLoveText: 'Je n’aime plus',
        lovedText: 'Coup de cœur',
        addAllText: `Ajouter${vars[0]} aux favoris`,
        addToLists: `Ajouter${vars[0]} aux listes`
    };

    return resources[label];
}
