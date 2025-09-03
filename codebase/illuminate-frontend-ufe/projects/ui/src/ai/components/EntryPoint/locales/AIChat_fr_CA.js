const resources = {
    new: 'nouveautés',
    aiChatInputPlaceholderPdp: 'Posez n’importe quelle question sur cet essentiel',
    aiChatInputPlaceholderPlp: 'Vous avez besoin d’aide pour trouver un essentiel?',
    aiChatInputPlaceholderPlpLgUi: 'Vous avez besoin d’aide pour trouver quelque chose?',
    aiChat: 'Clavardage IA'
};

export default function getResource(label) {
    return resources[label];
}
