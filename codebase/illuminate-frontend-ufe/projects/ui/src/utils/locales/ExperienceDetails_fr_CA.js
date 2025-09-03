export default function getResource(label, vars = []) {
    const resources = {
        reservationPolicies: 'Politiques relatives aux réservations',
        cancelationPolicyLabel: 'Politique d’annulation',
        cancelationPolicy: 'Vous pouvez annuler ou reporter votre rendez-vous jusqu’à 24 heures avant le service.',
        lateCancelOrNoShowFeeLabel: 'Frais d’annulation tardive ou d’absence',
        lateCancelOrNoShowFee: `Une carte de crédit est requise pour garantir cette réservation. Si vous annulez dans les 24 heures avant le service ou si vous ne vous présentez pas, des frais de ${vars[0]} vous seront facturés.`,
        paymentLabel: 'Paiement',
        payment: `Le paiement total de ${vars[0]} plus les taxes applicables sera perçu au moment du service avec le mode de paiement utilisé pour effectuer la réservation. Vous recevrez un courriel de confirmation lorsque votre paiement aura été traité. Le paiement ne peut être appliqué à l’achat d’un produit.`,
        paymentShort: `Le paiement total de ${vars[0]} plus les taxes applicables sera facturé au moment du service. Vous pouvez choisir d’échanger une carte-cadeau en magasin au moment du paiement.`,
        complementaryPayment: 'Gratuit avec un achat minimum de 50 $ en magasin le jour du rendez-vous.',
        virtual: 'Services virtuels',
        onTimeLabel: 'Politique relative à la ponctualité',
        onTimeText: 'Ne soyez pas en retard! Respectez le temps de nos conseillères en produits de beauté. Vous risquez de perdre votre rendez-vous si vous arrivez en retard.',
        telephoneUseAuthorization: 'J’autorise Sephora à utiliser les systèmes téléphoniques à composition automatique pour envoyer des messages textes sur mon téléphone mobile concernant mon rendez-vous. Je comprends que je ne suis pas obligé d’accepter de recevoir ces messages pour l’achat d’une propriété, d’un bien ou d’un service quelconque.',
        telephoneUseAuthorizationEDP: `J’autorise Sephora à utiliser des messages texte automatiques concernant mon rendez-vous. Le consentement n’est pas une condition d’achat.  Des frais de messagerie texte et de données peuvent s’appliquer. Modalités : ${vars[0]}`,
        scheduleAppointment: `Si vous souhaitez prendre rendez-vous plus de 90 jours à l’avance, communiquez avec votre ${vars[0]} favori.`,
        store: 'magasin',
        genericErrorMessage: 'Oups! Notre système de réservation en ligne n’est pas disponible pour le moment. Veuillez réessayer plus tard.',
        genericPaymentMessage: 'Nous n’avons pas été en mesure de traiter votre carte de crédit. Veuillez vérifier les renseignements relatifs à la carte et essayer à nouveau, ou utilisez une autre carte.'
    };

    return resources[label];
}
