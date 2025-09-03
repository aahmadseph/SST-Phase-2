const resources = {
    new: 'new',
    aiChatInputPlaceholderPdp: 'Ask any question about this product',
    aiChatInputPlaceholderPlp: 'Need help finding a product?',
    aiChatInputPlaceholderPlpLgUi: 'Need help finding?',
    aiChat: 'AI Chat'
};

export default function getResource(label) {
    return resources[label];
}
