export default function getResource(label) {
    const resources = {
        socialSecurityInfoText: 'Nous vous demandons votre numéro d’assurance sociale pour nous aider à vous identifier. Lorsque vous soumettrez votre demande en ligne, nous chiffrerons vos renseignements pour les protéger.',
        secureInfoTitle: '3. Renseignements protégés',
        dateOfBirth: 'Date de naissance',
        socialSecurityNumberLabel: 'Les 4 derniers chiffres du numéro d’assurance sociale',
        annualIncomeLabel: 'Revenu annuel (p. ex. : 45 000 $)*',
        alimonyText: 'Vous n’avez pas besoin d’inclure un revenu provenant d’une pension alimentaire pour vous-même ou les enfants ou de la séparation de biens si vous ne souhaitez pas qu’il soit pris en considération pour le remboursement de cette obligation.',
        marriedText: '*Pour les résidents du WI mariés seulement :* Si vous demandez un compte individuel et que votre conjoint(e) est également résident(e) du WI, veuillez combiner vos renseignements financiers avec ceux de votre conjoint(e).'
    };

    return resources[label];
}
