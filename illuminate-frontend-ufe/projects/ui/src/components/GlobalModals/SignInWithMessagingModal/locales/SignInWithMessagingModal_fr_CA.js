export default function getResource(label, vars = []) {
    const resources = {
        modalTitle: 'Veuillez ouvrir une session Sephora',
        termsOfUseLink: 'conditions d’utilisation de Sephora',
        privacyPolicyLink: 'politique de confidentialité',
        wantToSaveYourPoints: `Envie d’économiser vos ${vars[0]} points?`,
        pointsAndFreeShip: `Ouvrez une session pour enregistrer vos *${vars[0]} points Beauty Insider*, profiter de la *livraison standard GRATUITE* et échanger vos points pour des récompenses gratuites.`,
        pointsForBooking: `Ouvrez une session pour recevoir vos *${vars[0]} points Beauty Insider* à la fin de votre service.`
    };

    return resources[label];
}
