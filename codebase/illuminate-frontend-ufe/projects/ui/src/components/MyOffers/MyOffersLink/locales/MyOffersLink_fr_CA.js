
export default function getResource(label, vars = []) {
    const resources = {
        viewExclusiveOffer: `Découvrez une offre exclusive ${vars[0]} pour vous`,
        viewExclusiveOffers: `Découvrez des offres exclusives ${vars[0]} pour vous`,
        forYou: 'POUR VOUS'
    };

    return resources[label];
}
