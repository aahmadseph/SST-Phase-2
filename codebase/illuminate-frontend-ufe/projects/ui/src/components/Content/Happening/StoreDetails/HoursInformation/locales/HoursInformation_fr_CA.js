export default function getResource(label, vars = []) {
    const resources = {
        storeHours: 'Heures d’ouverture',
        storeClosed: 'Magasin fermé',
        openUntil: `Ouvert jusqu’à ${vars[0]} aujourd’hui`,
        tempClosed: 'Le magasin est temporairement fermé',
        tempUnavailable: 'Non disponible pour le moment',
        curbsideHours: 'Heures du ramassage à l’extérieur',
        availableUntil: `Disponible jusqu’à ${vars[0]} aujourd’hui`,
        unavailable: 'Non disponible',
        specialCurbsideHours: 'Heures spéciales du ramassage à l’extérieur',
        specialStoreHours: 'Heures d’ouverture spéciales',
        available: 'Disponible',
        specialOpenUntil: `Ouvert jusqu’à ${vars[0]}`,
        kohlMessage: 'Plongez dans l’expérience Sephora en magasinant les marques les plus populaires de maquillage, de soins pour la peau, d’essentiels pour les cheveux et de parfums.\n\n La plupart des promotions Sephora, y compris les points Beauty Insider, les récompenses et les cadeaux d’anniversaire, sont offertes chez Sephora dans les magasins Kohl’s.'
    };

    return resources[label];
}
