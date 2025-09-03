// Utility to remove all spaces from a string
export default function removeSpaces(str) {
    if (!str) {
        return '';
    }

    return str.replace(/\s+/g, '');
}
