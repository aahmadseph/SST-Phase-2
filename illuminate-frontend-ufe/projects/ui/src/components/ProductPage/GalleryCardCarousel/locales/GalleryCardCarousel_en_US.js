export default function getResource(label) {
    const resources = {
        seeItInRealLife: 'See It in Real Life',
        mentionSephora: 'Mention @sephora for a chance to be featured or upload to Gallery.',
        addYourPhoto: '+ Add your photo',
        addAPhoto: 'Add a photo',
        sorryNoImages: 'Sorry, no images match the applied filters.'
    };
    return resources[label];
}
