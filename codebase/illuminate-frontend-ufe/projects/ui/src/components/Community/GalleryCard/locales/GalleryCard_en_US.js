const resources = {
    playVideo: 'play video',
    love: 'love',
    unlove: 'unlove',
    loves: 'loves'
};

export default function getResource(label) {
    return resources[label];
}
