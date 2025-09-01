import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Grid, Button, Text } from 'components/ui';
import Textarea from 'components/Inputs/Textarea/Textarea';
import { fontSizes, space, colors } from 'style/config';

const MAX_COMMENT_CHARS = 1000;

class AdditionalCommentsStepEdit extends BaseClass {
    handleTextareaChange = event => {
        this.props.handleAdditionalCommentsChange(event.target.value);
    };

    render() {
        const { nextStep, taxClaimGetText, additionalComments, formErrors } = this.props;
        const additionalCommentsError =
            Array.isArray(formErrors?.additionalCommentsErrors) && formErrors?.additionalCommentsErrors?.length > 0
                ? formErrors.additionalCommentsErrors[0] || ''
                : '';

        return (
            <>
                {additionalCommentsError ? (
                    <Text
                        is='p'
                        css={styles.error}
                    >
                        {taxClaimGetText(additionalCommentsError)}
                    </Text>
                ) : (
                    <Text
                        is='p'
                        css={styles.copy}
                    >
                        {taxClaimGetText('additionalCommentsStepCopy')}
                    </Text>
                )}
                <Textarea
                    placeholder={taxClaimGetText('additionalCommentsStepPlaceholder')}
                    rows={20}
                    name='reviewBody'
                    maxLength={MAX_COMMENT_CHARS}
                    css={styles.textArea}
                    value={additionalComments}
                    onChange={this.handleTextareaChange}
                />
                <Grid justifyContent='flex-start'>
                    <Button
                        css={styles.nextButton}
                        variant='primary'
                        onClick={nextStep}
                        width='177px'
                    >
                        {taxClaimGetText('nextAction')}
                    </Button>
                </Grid>
            </>
        );
    }
}

class AdditionalCommentsStepView extends BaseClass {
    render() {
        const { additionalComments, taxClaimGetText } = this.props;
        const textToDisplay = additionalComments || taxClaimGetText('none');

        return (
            <>
                <Text
                    is='p'
                    css={styles.copy}
                >
                    {taxClaimGetText('additionalCommentsStepCopy')}
                </Text>
                <Text
                    is='p'
                    css={styles.copy}
                >
                    {textToDisplay}
                </Text>
            </>
        );
    }
}

const styles = {
    copy: {
        fontSize: fontSizes[2],
        lineHeight: '17px',
        marginTop: space[5],
        marginBottom: space[5]
    },
    textArea: {
        marginTop: space[5],
        resize: 'none'
    },
    nextButton: {
        marginTop: space[5]
    },
    error: {
        color: colors.red,
        marginTop: space[5],
        marginBottom: space[5]
    }
};

const AdditionalCommentsStepEditWrapped = wrapComponent(AdditionalCommentsStepEdit, 'AdditionalCommentsStepEdit');
const AdditionalCommentsStepViewWrapped = wrapComponent(AdditionalCommentsStepView, 'AdditionalCommentsStepView');

export default {
    AdditionalCommentsStepEditWrapped,
    AdditionalCommentsStepViewWrapped
};
