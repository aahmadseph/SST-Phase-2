export default function getResource(label, vars = []) {
    const resources = {
        colorIQDesc1: 'Use the ',
        shadeFinder: 'Shade Finder',
        colorIQDesc2: ` to identify your correct shade in every foundation product. Or head to a  [Sephora store|${vars[0]}] and ask for a Color IQ skin tone scan.`
    };
    return resources[label];
}
