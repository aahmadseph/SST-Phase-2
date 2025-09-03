export default function getResource(label, vars = []) {
    const resources = {
        happyBday: `Joyeux anniversaire, ${vars[0]}!`,
        msgGoodEvening: `Bonsoir, ${vars[0]}.`,
        msgGoodMorning: `Bonjour, ${vars[0]}.`,
        msgGoodAfternoon: `Bon après-midi, ${vars[0]}.`,
        msgSunday: `Dimanche, c’est jour de fête, ${vars[0]}.`,
        msgMonday: `Nouvelle semaine, nouveau look, ${vars[0]}.`,
        msgFriday: `Bon vendredi, ${vars[0]}.`,
        msgFriday2: `Bonjour ${vars[0]}, c’est vendredi!`,
        msgSaturday: `Bonne fin de semaine, ${vars[0]}.`,
        msgSaturday2: `Vive la fin de semaine, ${vars[0]}.`,
        beautiful: 'Beauté'
    };

    return resources[label];
}
