export default function getResource(label, vars = []) {
    const resources = {
        member: 'Membre',
        join: 'S’inscrire',
        new: `${vars[0]} nouveauté`
    };
    return resources[label];
}
