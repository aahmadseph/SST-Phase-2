export default function getResource(label, vars = []) {
    const resources = {
        loves: 'Loves',
        viewAllLovesAddList1: 'View all of your favorite items here by',
        viewAllLovesAddList2: 'adding them to your Loves list.'
    };
    return resources[label];
}
