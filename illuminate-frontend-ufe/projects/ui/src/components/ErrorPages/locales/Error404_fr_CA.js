export default function getResource(label, vars = []) {
    const resources = {
        sorry: 'Nous sommes désolés! La page que vous cherchez est introuvable.',
        try: 'Faites une recherche ou rendez-vous sur la page d’accueil pour continuer vos achats.',
        home: 'Aller à la Page d’accueil Sephora'
    };

    return resources[label];
}
