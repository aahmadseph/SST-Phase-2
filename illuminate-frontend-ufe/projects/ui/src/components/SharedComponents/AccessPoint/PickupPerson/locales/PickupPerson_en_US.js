export default function getResource(label, vars = []) {
    const resources = {
        pickupPerson: 'Pickup Person',
        pleaseHaveYour: 'Please have your ',
        photoId: 'photo ID ',
        addedInstructions: 'ready when you retrieve your order. ',
        idMustMatch: 'ID must match name and address above. ',
        packagesWillBeHeld: `Packages will be held for up-to ${vars[0]} days before being returned to us.`
    };

    return resources[label];
}
