export default function getResource(label) {
    const resources = {
        benefitsFor: 'Les avantages pour',
        sameDayUnlimited: 'Livraison le jour même illimitée',
        unavailable: 'sont temporairement indisponibles.',
        workingToResolve: 'Nous travaillons à résoudre le problème.'
    };

    return resources[label];
}
