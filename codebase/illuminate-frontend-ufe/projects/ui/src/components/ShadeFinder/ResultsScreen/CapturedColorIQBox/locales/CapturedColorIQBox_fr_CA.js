export default function getResource(label, vars = []) {
    const resources = {
        saveYourBeauryPrefs: 'Voulez-vous enregistrer cette couleur comme étant votre teinte Color IQ actuelle dans vos préférences beauté?',
        joinToSave: 'Inscrivez-vous au programme Beauty Insider pour économiser',
        signInToSave: 'Ouvrir une session pour enregistrer',
        save: 'Enregistrer',
        tooltipModalTitle: 'Préférences beauté',
        tooltipModalMessage: 'Vous pouvez enregistrer vos préférences beauté, comme Color IQ et vos préoccupations cheveux, dans votre compte pour profiter d’une expérience de magasinage personnalisée.',
        infoModalButton: 'Compris',
        savedPrefsModalTitle: 'Préférences beauté enregistrées',
        savedPrefsModalMessage: 'Vos préférences ont été enregistrées.',
        savedPrefsModalCancelButton: 'Modifier les préférences beauté',
        errorSavingModalTitle: 'Erreur',
        errorSavingModalMessage: 'Une erreur est survenue et nous n’avons pas pu traiter votre demande. Veuillez réessayer plus tard.',
        errorSavingModalButton: 'OK'
    };

    return resources[label];
}
