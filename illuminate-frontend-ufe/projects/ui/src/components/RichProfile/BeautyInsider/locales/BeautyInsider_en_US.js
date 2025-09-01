export default function getResource(label, vars = []) {
    const resources = {
        yearAtGlance: `${vars[0]} at a Glance`,
        chooseYour: `Choose Your ${vars[0]}`
    };

    return resources[label];
}
