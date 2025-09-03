export default function getResource(label, vars = []) {
    const resources = {
        happyBday: `Happy Birthday, ${vars[0]}!`,
        msgGoodEvening: `Good evening, ${vars[0]}.`,
        msgGoodMorning: `Good morning, ${vars[0]}.`,
        msgGoodAfternoon: `Good afternoon, ${vars[0]}.`,
        msgSunday: `Sunday Funday, ${vars[0]}.`,
        msgMonday: `New week, new you, ${vars[0]}.`,
        msgFriday: `Happy Friday, ${vars[0]}.`,
        msgFriday2: `Hi ${vars[0]}, Hello Friday!`,
        msgSaturday: `Happy weekend, ${vars[0]}.`,
        msgSaturday2: `Cheers to the weekend, ${vars[0]}.`,
        beautiful: 'Beautiful'
    };

    return resources[label];
}
