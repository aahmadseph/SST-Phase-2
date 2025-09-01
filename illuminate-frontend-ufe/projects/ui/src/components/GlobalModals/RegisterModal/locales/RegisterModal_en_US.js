export default function getResource(label, vars = []) {
    const resources = {
        modalTitleRegister: 'Register with Sephora',
        modalTitleCreate: 'Create An Account',
        modalTitleComplete: 'Complete Account Setup'
    };

    return resources[label];
}
