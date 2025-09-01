export default function getResource(label, vars = []) {
    const resources = {
        guestCheckoutMessage: 'Passage en caisse sans compte',
        createAccountCheckoutMessage: 'Créer un compte',
        youCanJoinMessage: 'Vous pouvez vous inscrire à notre programme de fidélisation gratuit après votre passage en caisse.',
        joinBeautyInsiderMessage: 'Adhérez au programme de fidélisation Beauty Insider gratuitement! Ce programme ouvre la porte aux économies, échantillons et plus.',
        continueGuestButton: 'Continuer sans créer de compte',
        createAccountButton: 'Créer un compte',
        checkOutAsAGuestButton: 'Passer à la caisse en tant qu’invité',
        freeBirthdayGift: 'Cadeau\nd’anniversaire GRATUIT',
        seasonalSavingsEvents: 'Économies\nsaisonnières',
        freeShipping: 'Livraison\nGRATUITE',
        bankYourBeautyPointsFree: `Accumulez *${vars[0]} points* et profitez de nombreux privilèges, y compris la *livraison standard GRATUITE* , en adhérant à Beauty Insider, notre programme de fidélisation GRATUIT.`
    };

    return resources[label];
}
