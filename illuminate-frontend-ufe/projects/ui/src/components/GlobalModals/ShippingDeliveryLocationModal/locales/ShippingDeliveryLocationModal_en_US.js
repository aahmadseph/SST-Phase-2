export default function getResource(label, vars = []) {
    const resources = {
        title: 'Shipping & Delivery Location',
        confirm: 'Confirm',
        cancel: 'Cancel',
        useLocation: 'Use current location',
        locationSharingDisabled: 'Location sharing disabled',
        locationUpdateSettings: 'To share your location, please update your browser settings.',
        ok: 'OK',
        zipCodePlaceholder: 'ZIP/Postal Code',
        emptyZipError: 'ZIP/Postal Code required.',
        invalidZipError: 'Please enter a valid ZIP/Postal Code.',
        changeLocation: 'Change Location',
        changeLocationMessage: 'The delivery location will be updated to',
        changeLocationMessage2: 'for all shipped items',
        currentLocationText: 'your current location'
    };

    return resources[label];
}
