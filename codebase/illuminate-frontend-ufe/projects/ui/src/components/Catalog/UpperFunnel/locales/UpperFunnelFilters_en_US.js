export default function getResource(label, vars = []) {
    const resources = {
        chooseStore: 'Choose a Store',
        setYourLocation: 'Set Your Location',
        pickup: 'Pickup',
        reset: 'Reset',
        pickupSelectedAriaDescription: `Pickup store ${vars[0]} is selected`,
        pickupNotSelectedAriaDescription: 'Choosing a pickup store may automatically update the product results that are displayed to match the selected store.',
        sameDaySelectedAriaDescription: `Same Day Delivery location ${vars[0]} is selected`,
        sameDayNotSelectedAriaDescription: 'Choosing a same day delivery location may automatically update the product results that are displayed to match the selected delivery location.'
    };

    return resources[label];
}
