export default function getResource(label) {
    const resources = { biUnavailable: 'Beauty Insider Points are not currently available. Please try again later.' };

    return resources[label];
}
