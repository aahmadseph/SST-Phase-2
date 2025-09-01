import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import {
    Button, Box, Grid, Text
} from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/QuestionsAndAnswers/locales', 'QuestionsAndAnswers');

function SubmitMessage({ isQuestion, isError, redirectTo }) {
    return (
        <Box maxWidth={612}>
            <Text
                is='h1'
                fontSize={['md', 'xl']}
                fontWeight='bold'
                lineHeight='tight'
                marginBottom='1em'
            >
                {isError ? getText('submissionNotReceived') : getText(isQuestion ? 'thankYouQuestion' : 'thankYouAnswer')}
            </Text>
            <Text
                is='p'
                marginBottom='1em'
            >
                {isError ? getText('submissionWrong') : getText('postedHour', [isQuestion ? 'question' : 'answer'])}
            </Text>

            <Grid
                gap={4}
                marginTop={[5, 6]}
                maxWidth={[null, 250]}
            >
                <Button
                    variant='primary'
                    onClick={redirectTo}
                    children={getText('back')}
                />
            </Grid>
        </Box>
    );
}

export default wrapFunctionalComponent(SubmitMessage, 'SubmitMessage');
