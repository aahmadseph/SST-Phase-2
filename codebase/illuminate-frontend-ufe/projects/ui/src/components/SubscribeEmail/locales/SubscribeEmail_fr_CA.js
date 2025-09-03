export default function getResource(label, vars = []) {
    const resources = {
        subscribeLabel: 'S’abonner aux courriels de Sephora',
        popoverContent: 'Sephora Beauty Canada, Inc. (160 Bloor St. East Suite 1100 Toronto, ON M4W 1B9 | Canada, sephora.ca) demande le consentement en son propre nom et au nom de Sephora USA, Inc. (350 Mission Street, Floor 7, San Francisco, CA 94105, sephora.com). Vous pouvez retirer votre consentement en tout temps.'
    };
    return resources[label];
}
