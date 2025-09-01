export default function getResource(label, vars = []) {
    const resources = {
        kilometer: 'kilomètre',
        mile: 'mille',
        away: 'absent',
        closed: 'Fermé',
        storeClosed: 'Magasin fermé',
        openUntil: `Ouvert jusqu’à ${vars[0]}`,
        getDirections: 'Obtenir l’itinéraire',
        kohlsCopy: 'Les promotions et les récompenses Sephora peuvent ne pas s’appliquer dans les magasins Kohl’s.'
    };

    return resources[label];
}
