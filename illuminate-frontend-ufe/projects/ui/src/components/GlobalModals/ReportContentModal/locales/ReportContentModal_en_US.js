const resources = {
    reportTitle: 'Report Photo or Video',
    subTitle1: 'If you want to report this content as inappropriate, please copy the link below and email it to',
    subTitle2: 'with a reason for reporting (briefly explain why you believe this content violates the community guidelines or terms)',
    copied: 'Copied',
    copy: 'Copy'
};

export default function getResource(label) {
    return resources[label];
}
