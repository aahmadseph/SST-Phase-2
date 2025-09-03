export default function getResource(label, vars = []) {
    const resources = {
        previewSettings: 'Preview Settings',
        showAssets: 'Show assets',
        active: 'Active',
        all: 'All',
        viewOnActualInventory: 'View based on actual inventory',
        viewAsInStock: 'View as in-stock (ignore inventory)',
        go: 'Go',
        toggleKillswitches: 'Toggle Killswitches',
        confirm: 'Confirm',
        profileAttributes: 'Preview with Profile Attributes',
        selectionErrors: 'There are errors in your selections.'
    };
    return resources[label];
}
