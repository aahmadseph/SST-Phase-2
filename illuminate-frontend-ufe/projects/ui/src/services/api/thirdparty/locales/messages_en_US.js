module.exports = function getResource(label, vars = []) {
    const resources = {
        bazaarVoiceApiRequestFailureReason: 'BazaarVoice is disabled',
        fieldValue: 'Field Value:',
        uploadPhotoRejectMessage: 'There was an issue with your upload. Your file extension must be .jpg, .png, .heic, .tiff or .gif and your file size must not exceed 5MB.',
        addStructureApiRequestFailureReason: 'AddStructure is disabled',
        playerLoadTimeoutRejectMessage: `Failed to load player in ${vars[0]} ms!`,
        lithiumApiRequestFailureReasonDisabled: 'Lithium is disabled',
        lithiumSessionExpired: 'session expired'
    };

    return resources[label];
};
