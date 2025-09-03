import localeUtils from 'utils/LanguageLocale';

export default function getResource(label, vars = []) {
    const getGeneralResource = localeUtils.getGeneralResourceFile();
    const resources = {
        conversationsLabel: 'Tous les entretiens sur la beauté. Posez des questions, publiez des réponses et participez \n aux conversations avec des personnes réelles, comme vous.',
        featuredPostsTitle: 'Publications favorites',
        myPostsTitle: 'Mes publications',
        postsTitle: 'Publications',
        noUserConversationsLabel: `${vars[1]} n’a encore publié aucune conversation.`,
        exploreAllConversationsLabel: 'Explorer toutes les conversations',
        startConversationLabel: 'Commencer une conversation'
    };

    return resources[label] || getGeneralResource(label);
}
