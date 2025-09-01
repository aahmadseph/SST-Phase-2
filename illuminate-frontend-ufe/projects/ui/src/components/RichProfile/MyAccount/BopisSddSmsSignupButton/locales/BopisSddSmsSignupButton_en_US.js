export default function getResource(label, vars = []) {
    const resources = {
        getSmsUpdates: 'Get SMS Updates',
        alreadyEnrolled: 'Already Enrolled in SMS Updates',
        orderDetailsAndSmsUpdates: 'See Order Details & Get SMS Updates'
    };
    return resources[label];
}
