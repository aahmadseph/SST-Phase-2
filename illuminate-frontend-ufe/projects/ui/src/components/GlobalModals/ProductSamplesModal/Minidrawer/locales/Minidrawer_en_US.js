export default function getResource(label, vars = []) {
    const resources = {
        samplesInBasket: 'Samples in basket',
        showMore: 'Show more',
        showLess: 'Show less',
        done: 'Done'
    };

    return resources[label];
}
