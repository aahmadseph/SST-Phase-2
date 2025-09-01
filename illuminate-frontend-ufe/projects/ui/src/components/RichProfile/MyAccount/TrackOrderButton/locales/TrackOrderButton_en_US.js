export default function getResource(label, vars = []) {
    const resources = {
        track: 'Track & Get SMS Updates',
        getFacebook: 'Get Facebook messenger updates on your order',
        trackCanceled: 'Tracking not available for canceled orders.',
        trackUnavailable: 'Tracking will become available when the order ships.',
        viewTrackingInfo: 'View tracking info'
    };
    return resources[label];
}
