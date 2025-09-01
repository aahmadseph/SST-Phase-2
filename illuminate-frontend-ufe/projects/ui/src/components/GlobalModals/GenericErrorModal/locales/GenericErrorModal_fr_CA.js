export default function getResource(label, vars = []) {
    const resources = {
        title: 'Erreur',
        header: 'Nous sommes désolés! Il semble y avoir un problème.',
        content: 'Nous sommes désolés, mais il semble y avoir un petit problème technique. Notre équipe de techniciens et techniciennes est en train d’exercer sa magie pour résoudre le problème et vous ramener à votre magasinage. Veuillez réessayer plus tard.',
        cta: 'Fermer'
    };

    return resources[label];
}
