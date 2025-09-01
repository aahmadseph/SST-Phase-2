const resources = {
    showPasswordLinkAriaLabel: 'Montrer le mot de passe',
    hidePasswordLinkAriaLabel: 'Cacher le mot de passe'
};

export default function getResource(label, vars = []) {
    return resources[label];
}
