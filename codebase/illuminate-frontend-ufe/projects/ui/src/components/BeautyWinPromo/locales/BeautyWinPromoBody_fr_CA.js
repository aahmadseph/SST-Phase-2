export default function getResource(label, vars = []) {
    const resources = {
        signInMessage: 'Veuillez ouvrir une session pour accéder à votre prime beauté Sephora.',
        signInMessageDescription: 'Votre offre personnelle vous attend.',
        signIn: 'Ouvrir une session',
        shopNow: 'Magasiner',
        exploreNow: 'Découvrir',
        useCode: `INSCRIRE LE CODE ${vars[0]}`,
        validUntil: `En vigueur jusqu’au ${vars[0]} ${vars[1]}`,
        oops: 'Oups',
        notAvailable: 'Vous n’êtes pas admissible à votre prix beauté Sephora pour le moment, , mais vous pouvez profiter des nombreuses autres offres intéressantes en cours : jetez-y un coup d’œil.',
        isExpired: 'Votre prime beauté Sephora est expirée, mais beaucoup d’autres offres intéressantes sont en cours.',
        notFound: 'Nous sommes désolés! La page que vous cherchez est introuvable.',
        goHome: 'Faites une recherche ou rendez-vous sur la page d’accueil pour continuer vos achats.',
        goHomeCTA: 'Aller à la Page d’accueil Sephora',
        wonderWhy: 'Vous vous demandez pourquoi vous avez reçu ce message?'
    };
    return resources[label];
}
