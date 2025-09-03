/* eslint-disable camelcase */
export default function getResource(label, vars = []) {
    const resources = {
        selectAllThatApply: 'Select all that apply',
        clear: 'Clear',
        apply: 'Apply',
        noResults: 'No Results.',
        notSure: 'Not sure',
        noPreference: 'No Preference',
        // ingredients
        aha_glycolic_acid: 'AHA/Glycolic Acid',
        alcoholFree: 'Alcohol Free',
        antioxidants: 'Antioxidants',
        benzoyl_peroxide: 'Benzoyl Peroxide',
        bondBuilding: 'Bond Building',
        cbd: 'CBD',
        cleanAtSephora: 'Clean at Sephora',
        crueltyFree: 'Cruelty-Free',
        fragrance_free: 'Fragrance Free',
        hyaluronic_acid: 'Hyaluronic Acid',
        hydroquinone: 'Hydroquinone',
        mineral: 'Mineral',
        mineralPhysical: 'Mineral Physical',
        naturallyDerived: 'Naturally Derived',
        niacinamide: 'Niacinamide',
        oil_free: 'Oil-free',
        organic: 'Organic',
        paraben_free: 'Paraben-free',
        peptides: 'Peptides',
        retinoid: 'Retinoid',
        salicylicAcid: 'Salicylic Acid',
        siliconeFree: 'Silicone Free',
        squalane: 'Squalane',
        sulfate_free: 'Sulfate-free',
        sulfur: 'Sulfur',
        vegan: 'Vegan',
        vitamin_c: 'Vitamin C',
        nonComedogenic: 'Non-Comedogenic',
        zinc: 'Zinc'
    };

    return resources[label];
}
