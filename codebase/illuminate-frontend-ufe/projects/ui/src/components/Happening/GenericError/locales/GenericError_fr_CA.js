export default function getResource(label) {
    const resources = {
        header: 'Nous sommes désolés! Il semble y avoir un problème.',
        p1: 'Nous sommes désolés, mais il semble y avoir un petit problème technique. Notre équipe de techniciens et techniciennes est en train d’exercer sa magie pour résoudre le problème et vous ramener à votre magasinage.',
        p2: 'Vous ne pouvez plus attendre? Pas de problème! Visitez nos magasins ou essayez notre application mobile pour une expérience de magasinage tout aussi incroyable.',
        cta: 'Trouver un magasin à proximité'
    };

    return resources[label];
}
