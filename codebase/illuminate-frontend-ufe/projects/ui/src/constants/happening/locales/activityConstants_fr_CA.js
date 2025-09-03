export default function getResource(label, vars = []) {
    const resources = {
        HAPPENING_AT_SEPHORA: 'En cours chez Sephora',
        SERVICE_AND_EVENTS: 'Services et événements chez Sephora',
        ANNOUNCEMENT_DISPLAY_TEXT: 'Nouveautés',

        SEO_SERVICES: 'Services',
        SEO_CLASSES: 'Ateliers',
        SEO_EVENTS: 'Événements',
        SEO_ANNOUNCEMENTS: 'Des annonces',

        FLAG_SERVICES: 'services',
        FLAG_CLASSES: 'atelier',
        FLAG_EVENTS: 'événement',

        CAROUSEL_TYPE_STORE: 'En cours chez Sephora',
        CAROUSEL_TYPE_FEATURED: 'Offres en vedette',
        CAROUSEL_TYPE_SERVICES: 'Services',
        CAROUSEL_TYPE_SERVICES_SUBTITLE: 'Des retouches aux séances de maquillage en passant par les masques express, réalisez vos objectifs beauté.',
        CAROUSEL_TYPE_CLASSES: 'Ateliers',
        CAROUSEL_TYPE_CLASSES_SUBTITLE: 'Apprenez des techniques de maquillage, personnalisez votre rituel de soin et bien plus lors de nos ateliers gratuits.',
        CAROUSEL_TYPE_EVENTS: 'Événements',
        CAROUSEL_TYPE_EVENTS_SUBTITLE: 'Emmenez une amie et joignez-vous à nous pour célébrer les meilleures marques, essayer de nouveaux produits et bien plus.',
        CAROUSEL_TYPE_ANNOUNCEMENTS_SUBTITLE: 'Soyez le premier au courant des apparitions des célébrités, des lancements de marques, des ouvertures de magasins et plus encore.',

        OLR_LANDING_PAGE_SEO_TITLE: 'En cours chez Sephora - Ateliers beauté, services, événements et annonces | Sephora',
        OLR_LANDING_PAGE_SEO_DESCRIPTION: 'Trouvez des renseignements sur la beauté en magasin, les services, es événements et les annonces chez Sephora.',

        RESERVATION_STATUS_BOOKED_LIST: 'Réservé',
        RESERVATION_STATUS_BOOKED: 'Réservé',
        RESERVATION_STATUS_RSVPD_LIST: 'Présence confirmée',
        RESERVATION_STATUS_RSVPD: 'Présence confirmée',
        RESERVATION_STATUS_WAITLISTED_LIST: 'Sur liste d’attente',
        RESERVATION_STATUS_WAITLISTED: 'Sur liste d’attente. Nous vous contacterons lorsqu’une place sera disponible.',
        RESERVATION_STATUS_CANCELED: 'Votre rendez-vous a été annulé. Merci pour votre réponse!',
        RESERVATION_STATUS_RESCHEDULED: 'Reportée',
        RESERVATION_STATUS_ERROR: 'Votre nouvelle réservation a été effectuée. Nous n’avons pas pu annuler votre ancienne réservation. Veuillez réessayer plus tard',

        WHAT_TO_EXPECT_SERVICES: 'Ce service est effectué par un conseiller beauté certifié au Studio Beauté. Il est préférable, mais pas obligatoire, de se présenter avec une peau non maquillée.',
        WHAT_TO_EXPECT_SERVICES_CANADA_OR_FREE: 'Tous les services sont réalisés par nos Conseillers beauté talentueux, dans un cadre personnel. Il est préférable d’avoir lavé son visage avant d’arriver, mais cela n’est pas nécessaire. L’application cible un train spécifique pour les Mini services et le visage complet pour les Services de luxe. La durée varie en fonction de votre sélection.',
        WHAT_TO_EXPECT_CLASSES: 'Les ateliers ont lieu en groupe et sont donnés par nos Conseillers beauté talentueux. Vous appliquerez tous les produits vous-même et rentrerez chez vous avec toutes les compétences nécessaires pour réussir le look chez vous. Les produits et pineaux sont fournis, sauf les faux cils, qui doivent être achetés.',

        ALL_STORES_TEXT: 'Tous les magasins',

        PRICE_FREE: 'GRATUIT',
        PAYMENT_HEADER: 'Paiement',
        PAYMENT_TEXT: 'Le paiement sera perçu en magasin au moment du service.',
        PAYMENT_WITH_PRICE_TEXT: `Le paiement de ${vars[0]} et les taxes applicables seront perçus en magasin au moment du service. Le paiement ne s’applique qu’au service et ne peut être appliqué à l’achat d’un produit.`,
        PAYMENT_TEXT_MAKEUP_DELUXE: 'Les frais de gestion s’appliquent à tous les clients de Sephora, peu importe le niveau Beauty Insider.',
        PAYMENT_TEXT_PERSONAL_SHOPPING_SERVICE: 'Gratuit avec un achat minimum de 50 $ en magasin le jour du rendez-vous.',
        ONTIME_HEADER: 'Politique relative à la ponctualité',
        ONTIME_TEXT: 'Ne soyez pas en retard! Respectez le temps de nos conseillères en produits de beauté. Vous risquez de perdre votre rendez-vous si vous arrivez en retard.'
    };

    return resources[label];
}
