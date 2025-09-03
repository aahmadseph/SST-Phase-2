export default function getResource(label, vars = []) {
    const resources = {
        titleNewUser: 'Account Creation Error',
        title: 'Email Update',
        message: `Are you sure <b>${vars[0]}</b> is the correct email?`,
        ok: 'Yes, Continue',
        cancel: 'No, Edit email'
    };

    return resources[label];
}
