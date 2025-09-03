import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Divider, Grid, Text, Button
} from 'components/ui';
import {
    borders, colors, fontSizes, fontWeights, lineHeights
} from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import { CategoryType } from 'components/RichProfile/MyAccount/TaxClaim/constants';

const ShowEditButtonComponent = ({ index, goToStep, showEditButton }) => {
    const getResource = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

    return showEditButton ? (
        <Button
            css={styles.editButton}
            width='41px'
            height='24px'
            variant='secondary'
            onClick={() => goToStep(index)}
            style={{ marginLeft: 'auto' }}
        >
            {getResource('editAction')}
        </Button>
    ) : null;
};

const UntouchedTaxComponent = ({
    label, index, goToStep, content, showViewMode, showEditButton
}) => {
    return (
        <Grid
            columns='1fr auto'
            rows='auto'
            alignItems='center'
            justifyItems='start'
        >
            <Text css={styles.unfocusedLabel}>{label}</Text>
            <ShowEditButtonComponent
                index={index}
                goToStep={goToStep}
                showEditButton={showEditButton}
            />
            {showViewMode ? <Box>{content}</Box> : null}
        </Grid>
    );
};

const Stepper = ({
    steps, currentStep, goToStep, wizardFormData, isFreightForwarderCert
}) => {
    const currentCategory = wizardFormData?.taxExemptionCategory;
    const isCertificateFreightForwarder = isFreightForwarderCert();

    // Determine whether to show the edit button based on the index and currentCategory
    // Determine whether to show the edit button based on the index and currentCategory
    const shouldShowEditButton = index => {
        // Define conditions where the button should be hidden
        const hideConditions = [
            index === 0, // Always hide for index 0 (category step)
            index === 3 && currentCategory === CategoryType.OTHER, // Hide for index 3 when category is OTHER
            index === 1 && currentCategory === CategoryType.EXPORT_SALE_FREIGHT_FORWARDER, // Hide for index 1 when category is EXPORT_SALE_FREIGHT_FORWARDER
            index === 3 && currentCategory === CategoryType.EXPORT_SALE_FREIGHT_FORWARDER && isCertificateFreightForwarder // Hide for index 1 when category is EXPORT_SALE_FREIGHT_FORWARDER
        ];

        // Return false if any hide condition is met, otherwise true
        return !hideConditions.some(condition => condition);
    };

    return (
        <Grid>
            <Grid item>
                {steps.map((step, index) => (
                    <Box key={step.label}>
                        {index > 0 && (
                            <Divider
                                marginY='24px'
                                borderColor={colors.black}
                                borderBottom={borders[2]}
                            />
                        )}

                        {currentStep === index ? (
                            <>
                                <Box>
                                    <Text
                                        is='h3'
                                        css={styles.label}
                                    >
                                        {step.label}
                                    </Text>
                                </Box>
                                <Box>{React.cloneElement(step.content.edit)}</Box>
                            </>
                        ) : (
                            <>
                                {step.isStepCompleted ? (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Text
                                                is='h3'
                                                css={styles.label}
                                            >
                                                {step.label}
                                            </Text>
                                            {shouldShowEditButton(index) && (
                                                <ShowEditButtonComponent
                                                    index={index}
                                                    goToStep={goToStep}
                                                    showEditButton={true} // Always show if `shouldShowEditButton` is true
                                                />
                                            )}
                                        </div>
                                        {React.cloneElement(step.content.view)}
                                    </>
                                ) : (
                                    <UntouchedTaxComponent
                                        label={step.label}
                                        index={index}
                                        goToStep={goToStep}
                                        content={step.content.view}
                                        showViewMode={false}
                                        showEditButton={false}
                                    />
                                )}
                            </>
                        )}
                    </Box>
                ))}
            </Grid>
        </Grid>
    );
};

const styles = {
    label: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold
    },
    content: {
        lineHeight: lineHeights.tight
    },
    unfocusedLabel: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: colors.gray
    },
    errorSublabel: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.normal,
        color: colors.red
    },
    editButton: {
        width: '41px',
        fontSize: fontSizes.base
    }
};

export default wrapFunctionalComponent(Stepper, 'Stepper');
