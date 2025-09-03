import localeUtils from 'utils/LanguageLocale';

export default function getResource(label, vars = []) {
    const getGeneralResource = localeUtils.getGeneralResourceFile();
    const resources = {
        conversationsLabel: 'Every beauty talks. Ask questions, post answers, and be part \n of conversations with real people like you.',
        featuredPostsTitle: 'Featured Posts',
        myPostsTitle: 'My Posts',
        postsTitle: 'Posts',
        noUserConversationsLabel: `${vars[1]} hasn’t posted any conversations yet.`,
        exploreAllConversationsLabel: 'Explore all conversations',
        startConversationLabel: 'Start a Conversation'
    };

    return resources[label] || getGeneralResource(label);
}
