export default function getResource(label, vars = []) {
    const resources = {
        featuredPosts: 'Featured Posts',
        myPosts: 'My Posts',
        posts: 'Posts',
        intro: 'Every beauty talks. Ask questions, post answers, and be part of conversations with real people like you.',
        hasntPostedAnyConversationsYet: `${vars[0]} hasn’t posted any conversations yet.`,
        exploreAllConversations: 'Explore all conversations',
        readMore: 'read more',
        userGeneratedImage: 'user generated image',
        replyIn: 'Reply in ',
        postIn: 'Post in ',
        startSConversation: 'Start a Conversation'
    };
    return resources[label];
}
