export default function getResource(label, vars = []) {
    const resources = {
        bioEmptyMessage: 'Votre signe astrologique est Vierge et vous avez une dépendance au brillant à lèvres? Cliquez sur modifier pour vous décrire en une ou deux phrases.',
        fullEmptyMessage: 'Votre signe astrologique est Vierge et vous avez une dépendance au brillant à lèvres? Cliquez sur modifier pour vous décrire en une ou deux phrases et ajouter vos liens Instagram et YouTube.',
        emptyMessage: 'n’as pas encore ajouté de bio.'
    };
    return resources[label];
}
