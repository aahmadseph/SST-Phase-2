export default function getResource(label, vars = []) {
    const resources = {
        cancel: 'Annuler',
        searchKeyword: 'Rechercher des commentaires à l’aide de mots-clés',
        sort: 'Trier',
        star: 'Étoile',
        shade: 'Teinte',
        colorADADescription: 'La sélection d’une couleur actualisera automatiquement les commentaires affichés pour correspondre à la couleur sélectionnée. Pour supprimer le filtre, cliquez sur le x près du filtre, ou cliquez sur Tout effacer pour supprimer tous les filtres.',
        filtersADADescription: 'Sélectionner un filtre ci-bas actualisera automatiquement la liste de commentaires affichés pour correspondre au(x) filtre(s) sélectionné(s). Plusieurs filtres peuvent être sélectionnés en même temps.  Pour supprimer un filtre, cliquez sur le x près du filtre, ou cliquez sur Tout effacer pour supprimer tous les filtres.',
        sortByADADescription: 'Le choix d’une option de tri mettra automatiquement à jour les commentaires affichés pour correspondre à l’option de tri sélectionnée.',
        title: 'Vos correspondances beauté',
        saveTraits: 'On dirait que vous n’avez pas inscrit vos traits beauté.',
        experience: 'Pour une expérience optimale, veuillez ajouter les caractéristiques suivantes : ',
        experienceValues: 'Ton de la peau, préoccupations en matière de peau, type de peau, type de cheveux, couleur des cheveux, préoccupations en matière de cheveux, couleur des yeux.',
        addTraits: 'Ajouter des caractéristiques',
        clearAll: 'Tout réinitialiser',
        beautyPreferences: 'Vos préférences beauté'
    };
    return resources[label];
}
