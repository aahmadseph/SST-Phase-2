
export default function getResource(label, vars = []) {
    const resources = {
        selectDay: 'Please select a day',
        prev: 'Previous',
        next: 'Next'
    };
    return resources[label];
}
