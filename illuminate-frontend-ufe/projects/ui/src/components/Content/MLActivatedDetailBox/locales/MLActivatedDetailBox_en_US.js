export default function getResource(label) {
    const resources = {
        startEndDates: 'Start Date and End Date',
        placement: 'Placement',
        modelOutput: 'Model Output',
        maxSlots: 'Max Number of Slots',
        mlActivatedComponent: 'ML Activated Component',
        closeMlActivatedDetails: 'Close ML Activated details'
    };

    return resources[label];
}
