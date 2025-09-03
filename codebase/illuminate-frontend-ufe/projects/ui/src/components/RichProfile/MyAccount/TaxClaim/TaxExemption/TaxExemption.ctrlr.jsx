import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Grid, Text } from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import { fontSizes, fontWeights, colors } from 'style/config';
import TaxFormValidator from 'components/RichProfile/MyAccount/TaxClaim/utils/TaxFormValidator';

class TaxExemption extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            selection: props.taxExemptionSelection ?? null,
            formErrors: {
                missingSelection: null
            }
        };
    }

    handleRadioChange = value => _ => {
        this.setState({ selection: value }, this.props.onSelection(value));

        this.resetErrors();
    };

    resetErrors = () => {
        this.setState({ formErrors: { missingSelection: null } });
    };

    render() {
        const { taxExemptionTitle, taxExemptionMissingSelection, formErrors, options } = this.props;

        const missingSelectionError = formErrors.includes(TaxFormValidator.VALIDATION_CONSTANTS.TAX_EXEMPTION_SELECTION_EMPTY);

        return (
            <Grid>
                <Box>
                    <Text
                        is='h1'
                        css={styles.subhead}
                        marginBottom='8px'
                    >
                        {taxExemptionTitle}
                    </Text>

                    {missingSelectionError ? (
                        <Text
                            css={styles.error}
                            role='alert'
                            aria-live='assertive'
                        >
                            {taxExemptionMissingSelection}
                        </Text>
                    ) : null}
                </Box>
                <Box>
                    {options.map(({ title, subtitle, optInForTaxExemption }) => (
                        <Grid
                            item
                            key={optInForTaxExemption}
                        >
                            <Radio
                                name='taxExemptionStatus'
                                value={optInForTaxExemption}
                                checked={this.state.selection === optInForTaxExemption}
                                onChange={this.handleRadioChange(optInForTaxExemption)}
                                hasFocusStyles={false}
                                css={styles.radioStyles}
                            >
                                <Text
                                    is='h1'
                                    children={title}
                                    css={styles.optionBold}
                                />
                                <Text
                                    is='p'
                                    children={subtitle}
                                />
                            </Radio>
                        </Grid>
                    ))}
                </Box>
            </Grid>
        );
    }
}

const styles = {
    subhead: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold
    },
    subtitle: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.normal
    },
    error: {
        fontSize: fontSizes.base,
        color: colors.red
    },
    radioStyles: {
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'row'
    },
    optionBold: {
        fontWeight: fontWeights.bold
    }
};

export default wrapComponent(TaxExemption, 'TaxExemption', true);
