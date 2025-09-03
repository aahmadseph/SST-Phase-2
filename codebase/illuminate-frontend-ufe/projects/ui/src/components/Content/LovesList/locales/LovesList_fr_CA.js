const resources = {
    signInButton: 'Ouvrir une session',
    signInText: ' pour voir votre liste de favoris.',
    yourLoves: 'Vos favoris apparaîtront ici.',
    yourSavedItems: 'Vos éléments enregistrés'
};

export default function getResource(label) {
    return resources[label];
}
