export default function getResource(label, vars=[]) {
    const resources = {
        service: 'Service',
        details: 'Details',
        artist: 'Artist: ',
        selectedFeature: `Selected Feature: ${vars[0]}`,
        specialRequests: `Special Request: ${vars[0]}`,
        notProvided: 'Special Request: Not Provided',
        location: 'Location',
        confirmationNumber: 'Confirmation #',
        payment: 'Payment',
        estimatedCost: 'Estimated Cost',
        taxesHit: 'state and local tax not displayed',
        paymentHold: 'Payment Method on hold',
        noArtist: 'Any Available Artist',
        getDirections: 'Get directions',
        defaultNoShow: '$0'
    };

    return resources[label];
}
