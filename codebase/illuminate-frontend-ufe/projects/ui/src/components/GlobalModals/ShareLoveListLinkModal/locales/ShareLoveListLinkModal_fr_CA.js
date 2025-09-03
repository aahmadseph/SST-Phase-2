export default function getResource(label, vars = []) {
    const resources = {
        copied: 'Lien copié',
        copy: 'Copier le lien',
        shareYourList: 'Partager votre liste',
        copyLinkText: 'Copiez le lien suivant et partagez-le avec vos ami(e)s :',
        cancel: 'Annuler'
    };
    return resources[label];
}
