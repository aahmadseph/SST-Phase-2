export default function getResource(label, vars = []) {
    const resources = {
        done: 'Terminé',
        close: 'Fermer',
        cancel: 'Annuler',
        continue: 'Continuer',
        sephoraCreditCard: 'Carte de crédit Sephora',
        noThanks: 'Non, merci',
        acceptNow: 'Oui, cela m’intéresse',
        notMe: 'Pas moi',
        congratulations: 'Félicitations,',
        fromTheRewardsBazaar: 'De la Foire aux récompenses Rewards Bazaar®',
        droppingTimeText: 'De nouvelles récompenses sont lancées chaque mardi et jeudi de 9 h à 17 h, HNP. Elles s’envolent à la vitesse de l’éclair, alors revenez souvent pour décrocher des expériences, des services personnalisés et des échantillons récompenses convoités.',
        oops: 'Oups',
        cannotExtendText: 'Nous n’avons pas pu prolonger votre session. Veuillez réessayer plus tard.',
        youEntered: 'Vous avez saisi :',
        recommended: 'Recommandée :',
        useTheAddress: 'Utiliser l’adresse que j’ai saisie',
        extendSessionTitle: 'Prolonger la session?',
        extendSessionButton: 'Prolonger la session',
        sessionExpireText: `Votre session expirera dans ${vars[0]} minutes et ${vars[1]} secondes en raison de votre inactivité.`
    };

    return resources[label];
}
