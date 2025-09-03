export default function getResource(label, vars = []) {
    const resources = {
        changeStore: 'Change Store',
        body: `<span>The pickup location will be updated to <b>${vars[0]}</b> for all pickup items.</span>`,
        cancel: 'Cancel',
        ok: 'OK'
    };

    return resources[label];
}
