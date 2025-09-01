const resources = {
    seeMore: 'Consulter d’autres évaluations qui mentionnent',
    linkLead: 'Hautement évalué par les clients pour :',
    modalTitle: 'Hautement évalué par les clients pour'
};

export default function getResource(label) {
    return resources[label];
}
