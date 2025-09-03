export default function getResource(label, vars = []) {
    const resources = {
        noStoreNear: `We were not able to find a store near “${vars[0]}”.`,
        pleaseTryDifferentLocation: 'Please try a different location.',
        localeError: `In order to select a store in ${vars[0]}, please go to the `,
        bottomOfSite: 'bottom of the site ',
        localeError2: `and change your Region to ${vars[0]}.`,
        localeErrorLine2: `Once you switch, any ${vars[0]}-restricted and/or Reserve & Pick Up items will be removed from your basket.`
    };

    return resources[label];
}
