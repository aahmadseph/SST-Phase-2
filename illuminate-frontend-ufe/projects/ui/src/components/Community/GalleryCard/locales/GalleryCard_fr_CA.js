const resources = {
    playVideo: 'lancer la vidéo',
    love: 'j’aime',
    unlove: 'je n’aime plus',
    loves: 'coups de cœur'
};

export default function getResource(label) {
    return resources[label];
}
