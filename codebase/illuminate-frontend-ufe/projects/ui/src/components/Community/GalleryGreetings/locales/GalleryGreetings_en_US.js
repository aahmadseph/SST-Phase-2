const resources = {
    title: 'Gallery',
    link: 'My Gallery',
    boxTitle: 'Hi! Are you new here?',
    boxDescription: 'See and be seen. Post and browse photos and videos from Beauty Insider Community members.',
    boxLink: 'Learn more',
    boxCTA: 'Got it'
};

export default function getResource(label) {
    return resources[label];
}
