export default function getResource (label, vars = []) {
    const resources = {
        month: 'Month',
        day: 'Day',
        year: 'Year'
    };
    return resources[label];
}
