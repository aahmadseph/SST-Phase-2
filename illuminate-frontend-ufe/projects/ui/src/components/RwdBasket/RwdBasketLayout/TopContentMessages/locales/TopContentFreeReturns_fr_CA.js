export default function getResource(label) {
    const resources = {
        freeReturns: 'Retours gratuits sur tous les achats*',
        infoIcon: 'Renseignements sur les retours gratuits'
    };

    return resources[label];
}
