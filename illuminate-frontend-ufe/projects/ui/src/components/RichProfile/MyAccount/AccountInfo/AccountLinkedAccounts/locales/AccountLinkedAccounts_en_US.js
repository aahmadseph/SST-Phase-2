export default function getResource(label, vars = []) {
    const resources = {
        linkedAccounts: 'Linked Accounts',
        unlink: 'Unlink',
        linkedOn: 'Linked on',
        unlinkAccount: 'Unlink Account',
        cancel: 'Cancel',
        areYouSure: `Are you sure you would like to unlink your Sephora account from ${vars[0]}?`,
        unlinkSuccess: `Your Sephora account has successfully been unlinked from ${vars[0]}.`,
        done: 'Done',
        faq: 'FAQs',
        unlinkError: `We’re sorry. We have encountered an error in unlinking your account. Please try again or contact Sephora via ${vars[0]} or phone at ${vars[1]}.`,
        editButton: 'Edit',
        chat: 'Chat'
    };
    return resources[label];
}
