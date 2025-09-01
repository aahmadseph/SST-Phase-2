export default function getResource(label, vars = []) {
    const resources = {
        gotIt: 'Compris',
        howDoPasskeysWork: 'Comment fonctionnent les clés d’accès?',
        howItWorks: 'Comment cela fonctionne',
        passkeyDescription: 'La clé d’accès est une solution de rechange simple et plus sécuritaire pour les mots de passe. Les clés d’accès utilisent l’option de verrouillage de votre appareil (p. ex., balayage du visage, empreinte digitale, NIP ou mot de passe) au lieu d’un mot de passe propre au compte Sephora, pour ouvrir une session de manière plus sécuritaire.',
        sephoraNeverReceivesYourData: 'Sephora ne reçoit jamais vos données biométriques, comme les empreintes digitales ou les balayages du visage, et vos informations de connexion restent sur votre appareil en toute sécurité.',
        useFaceFingerprintPinOrDevicePassword: 'Utilisez le balayage du visage, l’empreinte digitale, le NIP ou le mot de passe de l’appareil pour vous connecter à des appareils compatibles, seulement disponibles sur l’application Sephora pour iOS pour le moment.',
        yourPasskeyIsUnique: 'Votre clé d’accès est unique et ne fonctionne que sur l’appareil, l’application ou les navigateurs sur lesquels vous l’avez configurée. Aucun mot de passe n’est requis sur les appareils, applications ou navigateurs reconnus.',
        whatIsAPasskey: 'Qu’est-ce qu’une clé d’accès?'
    };

    return resources[label];
}
