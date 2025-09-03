export default function getResource(label, vars = []) {
    const resources = {
        guestSavingsMessage: `Save ${vars[0]} annually with this subscription.`,
        guestFirstYearSavingsMessage: `Save ${vars[0]} in your first year with this subscription.`,
        signedInSavingsMessage: `${vars[0]}, save ${vars[1]} annually with this subscription.`,
        signedInFirstYearSavingsMessage: `${vars[0]}, save ${vars[1]} in your first year with this subscription.`
    };

    return resources[label];
}
