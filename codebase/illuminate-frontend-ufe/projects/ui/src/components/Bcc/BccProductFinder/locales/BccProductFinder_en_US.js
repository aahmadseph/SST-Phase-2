export default function getResource(label) {
    const resources = { sorrySomethingWrong: 'We’re sorry, something went wrong. Please try again.' };
    return resources[label];
}
