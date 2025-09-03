export default function getResource(label) {
    const resources = {
        removePhoto: 'Remove Photo',
        addPhoto: 'Add Photo',
        somethingWentWrongError: 'There was an issue with your upload. Your file extension must be .jpg, .png, .heic, .tiff or .gif and your file size must not exceed 5MB.'
    };
    return resources[label];
}
