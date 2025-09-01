export default function getResource(label, vars = []) {
    const resources = {
        tooltipColorIQTitle: 'Couleur Qi',
        buttonGotIt: 'Compris',
        tooltipColorIQSubtitle1:
            'Color IQ est un système exclusif à Sephora qui vous aide à identifier la bonne teinte de chaque fond de teint et anticernes. Pour obtenir votre Color IQ, rendez-vous dans un magasin Sephora à proximité et demandez à un conseiller beauté de faire une lecture Color IQ pour vous. Ils utiliseront un appareil photo spécial pour déterminer votre ton et vos attributs. Le système se souviendra alors de vos données et l’ajoutera à votre profil ici.',
        tooltipColorIQSubtitle2:
            'Pour de meilleurs résultats, assurez-vous de prendre une lecture pendant les mois d’été et d’hiver, car le ton de la peau change naturellement au cours de l’année.'
    };

    return resources[label];
}
