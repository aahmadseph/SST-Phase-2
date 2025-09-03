export default function getResource(label, vars = []) {
    const resources = {
        text1Title1: 'Votre rapport de solvabilité et le prix que vous payez pour votre crédit',
        text1Title2: 'Qu’est-ce qu’un rapport de solvabilité?',
        text1paragraph1: 'Un rapport de solvabilité est un document compilant vos antécédents de crédit. Il indique si vous respectez les échéances de paiement de vos factures et les montants que vous devez à vos créanciers.',
        text1Title3: 'Comment avons-nous utilisé votre rapport de solvabilité?',
        text1paragraph2: 'Nous avons utilisé les renseignements de votre rapport de solvabilité pour établir les modalités du crédit que nous vous offrons, dont le pourcentage du taux annuel applicable.',
        text1paragraph3: 'Les modalités qui vous sont offertes pourraient être moins favorables que celles offertes aux consommateurs qui ont de meilleurs antécédents de crédit.',
        text1Title4: 'Qu’arrive-t-il s’il y a des erreurs dans votre rapport de solvabilité?',
        text1paragraph4: 'Vous avez le droit de contester toute information inexacte dans votre rapport de solvabilité.',
        text1paragraph5: 'Si vous trouvez des erreurs dans votre rapport de solvabilité, communiquez avec l’agence de renseignements sur le crédit à la consommation indiquée ci-dessous, de qui nous avons obtenu votre dossier de solvabilité.',
        text1paragraph6: 'Il est recommandé de vérifier votre rapport de solvabilité pour vous assurer que les renseignements qu’il contient sont exacts.',
        text1Title5: 'Comment pouvez-vous obtenir une copie de votre rapport de solvabilité?',
        text1paragraph7: 'En vertu de la loi fédérale, vous avez le droit d’obtenir une copie de votre rapport de solvabilité sans frais dans les 60 jours à compter de la réception de cet avis.',

        toObtainYourFreeReport: 'Pour obtenir votre rapport gratuitement, communiquez avec :',

        text2Title1: 'Comment pouvez-vous obtenir plus de renseignements à propos du rapport de solvabilité?',
        text2paragraph1: 'Pour obtenir de plus amples renseignements sur les rapports de crédit et vos droits en vertu de la loi fédérale, visitez le site Web du Bureau de la protection financière du consommateur à l’adresse [www.consumerfinanciale.gov/learnmore | https://www.consumerfinance.gov/learnmore]',
        text2Title2: 'Votre cote de crédit et comprendre votre cote de crédit',
        text2Title3: 'Ce que vous devez savoir au sujet des cotes de crédit.',
        text2paragraph2: 'Votre cote de crédit est un chiffre qui reflète les renseignements contenus dans votre dossier de solvabilité. Votre cote de crédit peut changer selon la façon dont vos antécédents de crédit évoluent.',

        yourCS: `Votre cote de crédit en date du ${vars[0]} : ${vars[1]}`,
        yourCSComment: 'Nous avons utilisé votre cote de crédit pour établir les modalités de crédit que nous vous offrons. Dans le système de cotation que nous avons utilisé, les cotes peuvent aller de 479 à 898. Veuillez noter qu’il existe différents systèmes de cotation du crédit et que chacun de ces systèmes utilise une plage de valeurs différentes.',
        highestKeyFactors: 'Voici les principaux facteurs clés ayant une incidence défavorable sur la cote :',
        ifYouHaveQuestions: 'Si vous avez des questions au sujet des facteurs ayant une incidence sur votre cote de crédit, nous vous encourageons à communiquer avec l’agence de renseignements sur le crédit à la consommation.'
    };

    return resources[label];
}
