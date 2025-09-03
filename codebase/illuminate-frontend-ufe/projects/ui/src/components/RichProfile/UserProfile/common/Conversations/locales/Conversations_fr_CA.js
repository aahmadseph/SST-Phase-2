export default function getResource(label, vars = []) {
    const resources = {
        featuredPosts: 'Publications favorites',
        myPosts: 'Mes publications',
        posts: 'Publications',
        intro: 'Tous les entretiens sur la beauté. Posez des questions, publiez des réponses et participez aux conversations avec des personnes réelles, comme vous.',
        hasntPostedAnyConversationsYet: `${vars[0]} n’a encore publié aucune conversation.`,
        exploreAllConversations: 'Explorer toutes les conversations',
        readMore: 'en lire plus',
        userGeneratedImage: 'image générée par l’utilisateur',
        replyIn: 'Répondre dans la conversation ',
        postIn: 'Publier dans la conversation ',
        startSConversation: 'Commencer une conversation'
    };
    return resources[label];
}
