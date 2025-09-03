const resources = {
    date: 'Date',
    next2Month: '2 prochains mois +',
    nextMonth: 'Le mois prochain',
    next2Weeks: '2 prochaines semaines',
    next7Days: '7 prochains jours',
    sort: 'Trier',
    closestDistance: 'Distance la plus proche',
    soonestDate: 'Date de la plus récente',
    locationAndStores: 'Emplacement et magasins',
    category: 'Catégorie'
};

export default function getResource(label) {
    return resources[label];
}
