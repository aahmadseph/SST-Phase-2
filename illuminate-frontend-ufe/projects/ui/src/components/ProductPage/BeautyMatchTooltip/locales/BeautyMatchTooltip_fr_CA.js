const resources = {
    beautyMatchesPopupText: 'Une correspondance beauté est une personne qui partage les mêmes caractéristiques beauté que vous (teint de la peau ou préoccupations en matière de cheveux, etc.). Pour une expérience optimale avec cette fonction, veuillez ajouter vos renseignements à vos',
    beautyMatchesPopupLink: 'Préférences beauté'
};

export default function getResource(label) {
    return resources[label];
}
