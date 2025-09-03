export default function getResource(label, vars = []) {
    const resources = {
        submit: 'soumettre',
        joinBI: 'S’inscrire à Beauty Insider',
        tellUsText: 'Parlez-nous de vous. Remplissez les Traits de beauté pour recevoir des conseils de produit personnalisés.',
        finishYourProfile: 'Complétez votre profil'
    };

    return resources[label];
}
