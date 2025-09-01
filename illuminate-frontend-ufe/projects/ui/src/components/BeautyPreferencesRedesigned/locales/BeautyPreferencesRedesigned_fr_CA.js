export default function getResource(label, vars = []) {
    const resources = {
        bpRedesignSubtitle: `En fonction des ${vars[0]} caractéristiques et préférences choisies.`,
        confettiModalTitleOneWorld: ' Bien joué! Continuez 🎉',
        confettiModalMessageOneWorld: 'Plus vous ajoutez de préférences, plus vous aurez de suggestions d’essentiels.',
        confettiModalTitleAllWords: ' Tout est fait! 🎉',
        confettiModalMessageAllWords: 'Vous avez bien défini vos préférences beauté pour votre profil. Vous pouvez maintenant profiter de recommandations personnalisées.',
        confettiModalButton: 'Compris'
    };
    return resources[label];
}
