const resources = {
    employeeFeedback: 'Employees: Experiencing issues? Let us know ▸',
    evergreen: 'Website feedback? Let us know ▸'
};

export default function getResource(label) {
    return resources[label];
}
