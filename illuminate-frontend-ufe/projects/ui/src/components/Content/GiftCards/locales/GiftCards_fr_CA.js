const resources = {
    checkYourBalance: 'Vérifier le solde',
    and: 'et',
    addToWallet: 'ajouter au portefeuille',
    enterGiftCardNumber: 'Entrez le numéro de votre carte-cadeau à 16 chiffres et le NIP.',
    reCaptcha: 'Sephora utilise ReCaptcha et les utilisateurs sont assujettis aux normes de Google en matière de',
    privacyPolicy: 'politique de confidentialité',
    terms: 'de paiement',
    balanceCall: 'Pour entendre votre solde, appelez',
    currentBalance: 'Solde actuel',
    cardNumber: 'Numéro de carte',
    pin: 'NIP',
    checkBalance: 'Vérifier le solde',
    balance: 'Solde',
    giftCardBalanceModalTitle: 'Solde de votre carte-cadeau',
    appleWalletDisclaimer: 'Ce solde continuera d’être disponible sur votre carte-cadeau physique ou électronique ainsi que dans votre portefeuille Apple.',
    googleWalletDisclaimer: 'Ce solde continuera d’être disponible sur votre carte-cadeau physique ou électronique ainsi que parmi vos cartes Google Wallet.',
    addTo: 'Ajouter à',
    appleWallet: 'Portefeuille Apple',
    googleWallet: 'Google Wallet',
    done: 'Terminé'
};

export default function getResource(label) {
    return resources[label];
}
