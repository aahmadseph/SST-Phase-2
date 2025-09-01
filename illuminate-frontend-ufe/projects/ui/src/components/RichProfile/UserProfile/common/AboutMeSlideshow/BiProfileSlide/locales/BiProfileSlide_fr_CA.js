export default function getResource(label, vars = []) {
    const resources = {
        privateEmptyContent: 'Vous cherchez des produits qui aident à combattre les frisottis? Vous cherchez une ombre à paupières époustouflante? Répondez à quelques brèves questions sur la beauté pour obtenir des recommandations personnalisées.',
        publicEmptyContent: `${vars[0]} n’a pas encore rempli de profil beauté.`,
        skin: 'Peau',
        hair: 'Cheveux',
        eyes: 'Yeux',
        colorIQ: 'Couleur Qi'
    };
    return resources[label];
}
