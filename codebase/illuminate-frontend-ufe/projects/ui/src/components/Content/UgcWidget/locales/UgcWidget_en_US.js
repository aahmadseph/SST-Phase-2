export default function getResource(label) {
    const resources = {
        seeItInRealLife: 'See It in Real Life',
        mentionSephora: 'Mention @sephora for a chance to be featured or upload to Gallery.',
        addYourPhoto: '+ Add your photo'
    };
    return resources[label];
}
