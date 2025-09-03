export default function getResource(label, vars = []) {
    const resources = {
        notifications: 'Notifications',
        reminders: 'Reminders',
        personalizedRecommendations: 'We’ll send you special personalized recommendations and other emails based on categories you shop most.',
        sampleEmail: 'See sample email',
        status: 'Status:',
        subscribed: 'Subscribed',
        notSubscribed: 'Not subscribed',
        subscribe: 'Subscribe',
        unsubscribe: 'Unsubscribe',
        cancel: 'Cancel',
        save: 'Save',
        edit: 'Edit'
    };
    return resources[label];
}
