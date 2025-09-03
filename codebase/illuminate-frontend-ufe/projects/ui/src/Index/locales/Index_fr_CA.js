module.exports = function getResource(label, vars = []) {
    const resources = {
        metaTitleBeautyStore: `Magasin & Services Beauté chez ${vars[0]} | Sephora ${vars[1]}`,
        metaDescVisitSephora: `Visitez Sephora ${vars[0]} à ${vars[1]}, ${vars[2]}. Découvrez notre sélection de produits de beauté de marques réputées, offrez-vous une transformation, inscrivez-vous à des cours de beauté et plus encore.`,
        metaDescFindAll: 'Trouvez tous les rayons de beauté dont vous rêviez chez Sephora. Explorez rapidement notre sélection imbattable de maquillage, de produits de soin, de parfums et d’autres produits des marques classiques et émergentes.',
        buyPageDescription: `${vars[0]} sont maintenant disponibles chez Sephora! Découvrez ${vars[0]} et trouvez l’essentiel qui convient le mieux à votre rituel beauté. Expédition gratuite et échantillons offerts.`,
        galleryPageTitle: 'Tendances beauté : galerie de photos et de vidéos | Sephora',
        galleryPageDescription: 'Vous cherchez de l’inspiration beauté tendance? Jetez un coup d’œil aux photos et aux vidéos des membres de la clientèle Sephora et téléversez les vôtres sur la galerie Sephora!'
    };
    return resources[label];
};
