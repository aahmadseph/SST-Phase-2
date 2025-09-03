import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Grid, Button, Text } from 'components/ui';
import { fontSizes, space, mediaQueries } from 'style/config';
import Copy from 'components/Content/Copy';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';

class FinalReviewStepEdit extends BaseClass {
    constructor(props) {
        super(props);
        // Initialize local state for checkbox and submission tracking
        this.state = {
            localIsAgreed: props.wizardFormData.isAgreed || false,
            hasSubmitted: false // Track whether the form has been submitted
        };
    }

    componentDidUpdate(prevProps) {
        // Sync local state with props if isAgreed changes
        if (prevProps.wizardFormData.isAgreed !== this.props.wizardFormData.isAgreed) {
            this.setState({ localIsAgreed: this.props.wizardFormData.isAgreed });
        }
    }

    handleCheckboxChange = e => {
        const isChecked = e.target.checked;
        this.setState({ localIsAgreed: isChecked }, () => {
            // Notify parent of the change
            this.props.handleFinalStepCheckBoxChange(isChecked);
        });
    };

    submitForm = async () => {
        // Set hasSubmitted to true to show error message if validation fails
        this.setState({ hasSubmitted: true });

        // Call the submit function passed as a prop
        await this.props.submitTaxClaimForm();
    };

    render() {
        const { taxClaimGetText, wizardFormData, formErrors } = this.props;
        const { consentCopy } = wizardFormData;
        const { localIsAgreed, hasSubmitted } = this.state;
        const { checkboxError } = formErrors;

        // Determine whether to show the error message
        const showError = hasSubmitted && checkboxError && !localIsAgreed;

        return (
            <>
                {showError ? (
                    <Text
                        is='p'
                        css={styles.error}
                    >
                        {taxClaimGetText('finalReviewStepErrorText')}
                    </Text>
                ) : (
                    <Text
                        is='p'
                        css={styles.copy}
                    >
                        {taxClaimGetText('finalReviewStepCopy')}
                    </Text>
                )}
                <div css={styles.checkboxContainer}>
                    <Checkbox
                        checked={localIsAgreed}
                        onChange={this.handleCheckboxChange}
                        hasHover={true}
                        marginRight={[4, 0]}
                    />
                    <Copy
                        marginTop={0}
                        marginBottom={0}
                        content={consentCopy}
                    />
                </div>
                <Grid justifyContent='flex-start'>
                    <Button
                        css={styles.submitButton}
                        variant='primary'
                        onClick={this.submitForm}
                        width='177px'
                    >
                        {taxClaimGetText('submitAction')}
                    </Button>
                </Grid>
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
    submitButton: {
        marginTop: space[5]
    },
    error: {
        color: 'red',
        marginTop: space[5],
        marginBottom: space[5],
        fontSize: fontSizes[2],
        lineHeight: '17px'
    },
    checkboxContainer: {
        display: 'flex',
        [mediaQueries.sm]: {
            alignItems: 'center'
        }
    }
};

const FinalReviewStepEditWrapped = wrapComponent(FinalReviewStepEdit, 'FinalReviewStepEdit', true);

export default {
    FinalReviewStepEditWrapped
};
