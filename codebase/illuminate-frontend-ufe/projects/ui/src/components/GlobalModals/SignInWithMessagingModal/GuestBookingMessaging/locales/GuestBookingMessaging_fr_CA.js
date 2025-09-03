export default function getResource(label, vars = []) {
    const resources = {
        createAccountButton: 'Créer un compte',
        bookingAsAGuestButton: 'Continuer sans créer de compte',
        freeBirthdayGift: 'Cadeau\nd’anniversaire GRATUIT',
        seasonalSavingsEvents: 'Économies\nsaisonnières',
        freeShipping: 'Livraison\nGRATUITE',
        bankYourBeautyPointsFree: `Vous accumulerez *${vars[0]} points* à la fin de ce service. -- Profitez de grands privilèges, y compris *l’expédition standard GRATUITE* -- en devenant membre Beauty Insider, notre programme de fidélisation GRATUIT.`,
        createAccountBookingMessage: 'Créer un compte'
    };

    return resources[label];
}
