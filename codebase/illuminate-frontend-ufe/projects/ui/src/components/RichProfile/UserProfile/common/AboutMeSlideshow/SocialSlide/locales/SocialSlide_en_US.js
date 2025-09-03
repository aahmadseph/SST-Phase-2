export default function getResource(label, vars = []) {
    const resources = {
        bioEmptyMessage: 'Are you a Virgo with an addiction to lip gloss? Click edit to describe yourself in a sentence or two.',
        fullEmptyMessage: 'Are you a Virgo with an addiction to lip gloss? Click edit to describe yourself in a sentence or two and add your Instagram and YouTube handles.',
        emptyMessage: 'hasn’t added a bio yet.'
    };
    return resources[label];
}
