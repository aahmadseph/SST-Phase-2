export default function getResource(label, vars = []) {
    const resources = {
        anonymousHeading: 'Veuillez ouvrir une session pour accéder à votre prime beauté Sephora.',
        anonymousText: 'Votre offre personnelle vous attend.',
        anonymousButtonText: 'Ouvrir une session',
        expiredHeading: 'L’offre n’est plus disponible',
        expiredText: 'Votre prime beauté Sephora est expirée, mais beaucoup d’autres offres intéressantes sont en cours.',
        exploreNowButton: 'Découvrir',
        unqualifiedHeading: 'Désolé, vous n’êtes pas admissible à cette offre',
        unqualifiedText: 'Vous n’êtes pas admissible à votre prime beauté Sephora pour le moment, mais vous pouvez profiter des nombreuses autres offres intéressantes en cours : jetez-y un coup d’œil.',
        apiFailedHeading: 'Désolé, la page que vous cherchez est introuvable.',
        apiFailedText: 'Faites une recherche ou rendez-vous sur la page d’accueil pour continuer vos achats.',
        apiFailedButton: 'Aller à la Page d’accueil Sephora'
    };

    return resources[label];
}
