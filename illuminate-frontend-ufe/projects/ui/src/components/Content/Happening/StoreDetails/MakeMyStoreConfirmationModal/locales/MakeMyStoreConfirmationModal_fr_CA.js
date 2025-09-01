export default function getResource(label, vars = []) {
    const resources = {
        changeStore: 'Changer de magasin',
        body: `<span>Le lieu de ramassage sera mis à jour <b>${vars[0]}</b> pour tous les articles à ramasser.</span>`,
        cancel: 'Annuler',
        ok: 'OK'
    };

    return resources[label];
}
