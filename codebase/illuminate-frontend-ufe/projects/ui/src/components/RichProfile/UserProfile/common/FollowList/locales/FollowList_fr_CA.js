export default function getResource(label, vars = []) {
    const resources = {
        noFollowersMessage: 'Vous n’avez encore aucun abonné.',
        noFollowersMessageBr: 'Vos abonnés apparaîtront ici.',
        memberHasNoFollowers: 'Ce membre n’a pas encore d’abonnés.',
        noFollowingAnyoneYet: 'Vous ne suivez encore personne.',
        followingInstructions: 'Pour suivre quelqu’un, il suffit de cliquer sur le bouton « S’abonner » sur son profil.',
        toViewYourProfile: 'Pour afficher votre profil, veuillez',
        signIn: 'ouvrir une session',
        followers: 'Abonnés',
        following: 'Abonnements',
        noFollowing: 'ne suit encore personne.',
        follow: 'S’abonner',
        backToProfileLink: 'Retour au profil',
        backToProfileLinkNickname: `Retour au profile de ${vars[0] + '’s'}`,
        followUser: `Suivre ${vars[0]}`
    };
    return resources[label];
}
