/* eslint-disable camelcase */
export default function getResource(label, vars = []) {
    const resources = {
        selectAllThatApply: 'Sélectionner toutes les options qui s’appliquent',
        clear: 'Réinitialiser',
        apply: 'Appliquer',
        noResults: 'Aucun résultat.',
        notSure: 'Je ne sais pas',
        noPreference: 'Aucune préférence',
        // ingredients
        aha_glycolic_acid: 'AHA/acide glycolique',
        alcoholFree: 'Sans alcool',
        antioxidants: 'Antioxydants',
        benzoyl_peroxide: 'Peroxyde de benzoyle',
        bondBuilding: 'Renforcement des liaisons',
        cbd: 'CBD',
        cleanAtSephora: 'Pur et sain Sephora',
        crueltyFree: 'Non testé sur les animaux',
        fragrance_free: 'Sans parfum',
        hyaluronic_acid: 'Acide hyaluronique',
        hydroquinone: 'Hydroquinone',
        mineral: 'Minéral',
        mineralPhysical: 'Minéral physique',
        naturallyDerived: 'D’origine naturelle',
        niacinamide: 'Niacinamide',
        oil_free: 'Sans huile',
        organic: 'Biologique',
        paraben_free: 'Sans parabène',
        peptides: 'Peptides',
        retinoid: 'Rétinoïde',
        salicylicAcid: 'Acide salicylique',
        siliconeFree: 'Sans silicone',
        squalane: 'Squalane',
        sulfate_free: 'Sans sulfate',
        sulfur: 'Soufre',
        vegan: 'Végane',
        vitamin_c: 'Vitamine C',
        nonComedogenic: 'Non comédogène',
        zinc: 'Zinc'
    };

    return resources[label];
}
