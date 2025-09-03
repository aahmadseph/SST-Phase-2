export default function getResource(label, vars = []) {
    const resources = {
        copied: 'Link Copied',
        copy: 'Copy Link',
        shareYourList: 'Share Your List',
        copyLinkText: 'Copy the link and share it with friends:',
        cancel: 'Cancel'
    };
    return resources[label];
}
