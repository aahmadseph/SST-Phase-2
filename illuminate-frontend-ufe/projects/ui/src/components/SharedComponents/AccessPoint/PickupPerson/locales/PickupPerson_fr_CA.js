export default function getResource(label, vars = []) {
    const resources = {
        pickupPerson: 'Personne qui ramassera la commande',
        pleaseHaveYour: 'Veuillez avoir en main votre ',
        photoId: 'une pièce d’identité avec photo ',
        addedInstructions: 'au moment du ramassage de votre commande. ',
        idMustMatch: 'La pièce d’identité doit correspondre au nom et à l’adresse ci-dessus. ',
        packagesWillBeHeld: `Les colis seront conservés pendant ${vars[0]} jours avant d’être retournés.`
    };

    return resources[label];
}
