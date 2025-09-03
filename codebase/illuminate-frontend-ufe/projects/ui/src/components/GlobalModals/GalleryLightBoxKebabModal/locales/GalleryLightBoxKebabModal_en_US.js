const resources = {
    shareOrDelete: 'Share or Delete',
    share: 'Share',
    delete: 'Delete',
    shareOrReport: 'Share or Report',
    report: 'Report',
    shareSubTitle: 'Copy the following link to share.',
    cancel: 'Cancel',
    deleteTitle: 'Delete Photo or Video',
    deleteSubTitle: 'Are you sure you want to delete this photo or video? Once deleted your photo and all the details will be permanently removed.',
    deleteConfirmation: 'Your photo or video has been successfully deleted. Please allow one hour for the photo to be removed.',
    done: 'Done'
};

export default function getResource(label) {
    return resources[label];
}
