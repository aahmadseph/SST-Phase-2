export default function getResource(label, vars = []) {
    const resources = {
        guestSavingsMessage: `Économisez ${vars[0]} chaque année grâce à cet abonnement.`,
        guestFirstYearSavingsMessage: `Économisez ${vars[0]} au cours de la première année de votre abonnement.`,
        signedInSavingsMessage: `${vars[0]}, économisez ${vars[1]} chaque année avec cet abonnement.`,
        signedInFirstYearSavingsMessage: `${vars[0]}, économisez ${vars[1]} au cours de la première année de votre abonnement.`
    };

    return resources[label];
}
