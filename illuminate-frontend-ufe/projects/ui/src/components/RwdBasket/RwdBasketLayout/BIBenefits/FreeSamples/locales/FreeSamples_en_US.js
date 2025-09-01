export default function getResource(label, vars = []) {
    const resources = {
        samplesText: 'Add up to 2 Free Samples',
        samplesSubText: `<b>${vars[0]} of 2</b> added for Get It Shipped`
    };

    return resources[label];
}
