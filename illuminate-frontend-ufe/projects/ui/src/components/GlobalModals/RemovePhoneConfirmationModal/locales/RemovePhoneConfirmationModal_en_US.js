export default function getResource(label, vars = []) {
    const resources = {
        title: 'Remove Phone Number',
        message: `Are you sure you want to remove <b>${vars[0]}</b> ? Removing number may make it harder to look up your account in store and stay in the know on exclusive deals & drops.`,
        messageLine2: 'Any active subscription of Sephora Text Alert subscriptions will be unsubscribed from the number above.',
        ok: 'Yes, Continue',
        cancel: 'Cancel'
    };

    return resources[label];
}
