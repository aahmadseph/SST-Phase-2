export default function getResource(label, vars = []) {
    const resources = {
        text1Title1: 'Your Credit Report and the Price You Pay for Credit',
        text1Title2: 'What is a credit report?',
        text1paragraph1: 'A credit report is a record of your credit history. It includes information about whether you pay your bills on time and how much you owe to creditors.',
        text1Title3: 'How did we use your credit report?',
        text1paragraph2: 'We used information from your credit report to set the terms of the credit we are offering you, such as the Annual Percentage Rate.',
        text1paragraph3: 'The terms offered to you may be less favorable than the terms offered to consumers who have better credit histories.',
        text1Title4: 'What if there are mistakes in your credit report?',
        text1paragraph4: 'You have the right to dispute any inaccurate information in your credit report.',
        text1paragraph5: 'If you find mistakes on your credit report, contact the consumer reporting agency listed below, which is the consumer reporting agency from which we obtained your credit report.',
        text1paragraph6: 'It is a good idea to check your credit report to make sure the information it contains is accurate.',
        text1Title5: 'How can you obtain a copy of your credit report?',
        text1paragraph7: 'Under Federal law, you have the right to obtain a copy of your credit report without charge for 60 days after you receive this notice.',

        toObtainYourFreeReport: 'To obtain your free report, contact:',

        text2Title1: 'How can you get more information about credit report?',
        text2paragraph1: 'For more information about credit reports and your rights under federal law, visit Consumer Financial Protection Bureau’s website at [www.consumerfinance.gov/learnmore | https://www.consumerfinance.gov/learnmore]',
        text2Title2: 'Your Credit Score and Understanding Your Credit Score',
        text2Title3: 'What you should know about credit scores.',
        text2paragraph2: 'Your credit score is a number that reflects the information in your credit report. Your credit score can change, depending on how your credit history changes.',

        yourCS: `Your credit score as of ${vars[0]}: ${vars[1]}`,
        yourCSComment: 'We used your credit score to set terms of credit we are offering you. In the scoring system we used, scores can range from 479 to the possible score, 898. Please be aware, there are a number of different credit scoring systems available, and each uses a different range of numbers.',
        highestKeyFactors: 'Here are the highest key factors that adversely affected the score:',
        ifYouHaveQuestions: 'If you have any questions about the factors impacting your credit score, we encourage you to contact the consumer reporting agency.'
    };

    return resources[label];
}
