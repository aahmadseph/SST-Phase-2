export default function getResource(label, vars = []) {
    const resources = {
        yearAtGlance: `${vars[0]} en un coup d’œil`,
        chooseYour: `Choisissez votre ${vars[0]}`
    };

    return resources[label];
}
