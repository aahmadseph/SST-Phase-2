export default function getResource(label, vars = []) {
    const resources = {
        SHORTENED_MONTHS: [
            'Jan',
            'Fév',
            'Mar',
            'Avr',
            'Mai',
            'Juin',
            'Juil',
            'Août',
            'Sep',
            'Oct',
            'Nov',
            'Déc'
        ],
        MONTHS: [
            'Janvier',
            'Février',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juillet',
            'Août',
            'Septembre',
            'Octobre',
            'Novembre',
            'Décembre'
        ],
        DAYS: [
            'Dimanche',
            'Lundi',
            'Mardi',
            'Mercredi',
            'Jeudi',
            'Vendredi',
            'Samedi'
        ],
        SHORTENED_DAYS: [
            'Dim',
            'Lun',
            'Mar',
            'Mer',
            'Jeu',
            'Ven',
            'Sam'
        ],
        TODAY: 'Aujourd’hui',
        TOMORROW: 'Demain'
    };

    return resources[label];
}
