export default function getResource(label) {
    const resources = { giftCardMessage: 'This message will be printed and included with your gift card.' };

    return resources[label];
}
