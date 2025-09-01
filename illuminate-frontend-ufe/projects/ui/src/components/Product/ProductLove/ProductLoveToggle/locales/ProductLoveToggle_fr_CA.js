export default function getResource (label, vars = []) {
    const resources = {
        signInAriaLabel: `Ouvrir une session pour ajouter des Favoris ${vars[0]}`,
        unloveLabel: 'Je n’aime plus',
        loveLabel: 'Favori'
    };
    return resources[label];
}
