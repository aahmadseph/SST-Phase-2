export default function getResource(label, vars = []) {
    const resources = { mostMention: 'Les plus mentionnés' };
    return resources[label];
}
