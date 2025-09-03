const resources = {
    showPasswordLinkAriaLabel: 'Show password text',
    hidePasswordLinkAriaLabel: 'Hide password text'
};

export default function getResource(label, vars = []) {
    return resources[label];
}
