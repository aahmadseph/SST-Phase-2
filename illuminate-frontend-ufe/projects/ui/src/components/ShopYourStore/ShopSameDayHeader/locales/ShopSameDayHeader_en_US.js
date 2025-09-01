export default function getResource(label, vars = []) {
    const resources = {
        shopSdd: 'Shop Same-Day Delivery',
        notAvailableForZipCode: `Not available for *${vars[0]}*.`,
        checkAnotherLocation: 'Check another location'
    };

    return resources[label];
}
