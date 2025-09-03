export default function getResource(label, vars = []) {
    const resources = {
        subscribeLabel: 'Subscribe to Sephora emails',
        popoverContent: 'Sephora Beauty Canada, Inc. (160 Bloor St. East Suite 1100 Toronto, ON M4W 1B9 | Canada, sephora.ca) is requesting consent on its own behalf and on behalf of Sephora USA, Inc. (350 Mission Street, Floor 7, San Francisco, CA 94105, sephora.com). You may withdraw your consent at any time.'
    };
    return resources[label];
}
