export default function getResource(label, vars = []) {
    const resources = {
        samplesSelectedText: `${vars[0]} échantillon(s) choisi(s) sur ${vars[1]}`,
        selectSamplesOrderText: `Vous pouvez sélectionner jusqu’à ${vars[0]} échantillon(s) par commande.`
    };

    return resources[label];
}
