export default function getResource(label) {
    const resources = {
        noteText: 'Unless otherwise noted, any information you supply will become part of your public profile when you submit your review.',
        noteLabel: 'Note'
    };
    return resources[label];
}
