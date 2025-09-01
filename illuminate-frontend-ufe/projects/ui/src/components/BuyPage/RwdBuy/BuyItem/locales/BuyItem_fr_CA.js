export default function getResource(label) {
    const resources = {
        size: 'Format',
        item: 'ARTICLE',
        moreColors: 'plus de couleurss',
        review: 'Commentaire',
        buyNow: 'Acheter',
        less: 'voir moins',
        more: 'voir plus'
    };

    return resources[label];
}
