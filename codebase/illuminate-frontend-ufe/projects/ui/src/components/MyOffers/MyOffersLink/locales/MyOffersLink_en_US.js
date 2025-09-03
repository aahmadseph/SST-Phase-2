
export default function getResource(label, vars = []) {
    const resources = {
        viewExclusiveOffer: `View ${vars[0]} exclusive offer for you`,
        viewExclusiveOffers: `View ${vars[0]} exclusive offers for you`,
        forYou: 'FOR YOU'
    };

    return resources[label];
}
