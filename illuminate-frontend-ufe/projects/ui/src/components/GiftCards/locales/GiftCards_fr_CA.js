export default function getResource(label, vars = []) {
    const resources = {
        giftCardBalance: 'Solde de carte-cadeau',
        checkYourBalance: 'Vérifier le solde',
        and: 'et',
        addToWallet: 'ajouter au portefeuille',
        toCheckCurrentBalance: 'Entrez le numéro de votre carte-cadeau à 16 chiffres et le NIP.',
        balance: 'Solde',
        cardNumber: 'Numéro de carte',
        pin: 'NIP',
        check: 'Vérifier',
        checkBalance: 'Vérifier le solde',
        giftCardBalanceModalTitle: 'Solde de votre carte-cadeau',
        appleWalletDisclaimer: 'Ce solde continuera d’être disponible sur votre carte-cadeau physique ou électronique ainsi que dans votre portefeuille Apple.',
        googleWalletDisclaimer: 'Ce solde continuera d’être disponible sur votre carte-cadeau physique ou électronique ainsi que parmi vos cartes Google Wallet.',
        addTo: 'Ajouter à',
        appleWallet: 'Portefeuille Apple',
        googleWallet: 'Google Wallet',
        done: 'Terminé'
    };

    return resources[label];
}
