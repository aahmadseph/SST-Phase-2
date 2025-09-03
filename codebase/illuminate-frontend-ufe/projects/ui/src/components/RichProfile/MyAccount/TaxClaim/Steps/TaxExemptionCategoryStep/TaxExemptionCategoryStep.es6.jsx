import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Grid, Text, Button } from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import { colors, fontSizes } from 'style/config';
import { validateStep } from 'utils/taxExemption/taxExemptionCategoryUtils';

class TaxExemptionCategoryStepEdit extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategory: null,
            formErrors: {
                missingCategory: null
            }
        };
    }

    handleRadioChange = _ => event => {
        const selectedValue = event.target.value;

        this.setState({ selectedCategory: selectedValue });
        this.resetErrors();
    };

    submit = async () => {
        const { selectedCategory } = this.state;
        const { isValid, errors } = validateStep({ selectedCategory });

        if (!isValid) {
            this.setState({ formErrors: errors });
        } else {
            this.props.addWizardFormData(selectedCategory, {
                stepData: [
                    {
                        currentStep: 0,
                        formData: {
                            taxExemptionCategory: selectedCategory
                        }
                    }
                ]
            });

            await this.props.nextStep();
        }
    };

    resetErrors() {
        this.setState({ formErrors: { missingCategory: null } });
    }

    render() {
        const { categories, categoryStepSubtitle, nextAction } = this.props;
        const { selectedCategory } = this.state;

        return (
            <>
                <Text
                    is='h3'
                    fontSize={fontSizes.base}
                    color={this.state?.formErrors?.missingCategory && colors.red}
                >
                    {categoryStepSubtitle}
                </Text>
                <Grid marginTop={6}>
                    {categories.map(({ categoryType, displayName }) => (
                        <Grid
                            item
                            key={categoryType}
                        >
                            <Radio
                                name='taxExemptionCategory'
                                value={categoryType}
                                checked={categoryType === selectedCategory}
                                onChange={this.handleRadioChange(categoryType)}
                                hasFocusStyles={false}
                            >
                                <Text children={displayName} />
                            </Radio>
                        </Grid>
                    ))}
                    <Grid justifyContent='flex-start'>
                        <Button
                            css={styles.nextButton}
                            variant='primary'
                            onClick={this.submit}
                            width='177px'
                        >
                            {nextAction}
                        </Button>
                    </Grid>
                </Grid>
            </>
        );
    }
}

class TaxExemptionCategoryStepView extends BaseClass {
    render() {
        const { categories, selectedCategory } = this.props;
        const categoryTitle = categories.find(({ categoryType }) => categoryType === selectedCategory).displayName;

        return (
            <div>
                <Text
                    is='p'
                    marginTop='16px'
                >
                    {categoryTitle}
                </Text>
            </div>
        );
    }
}

const styles = {
    nextButton: {
        marginTop: '24px'
    }
};

const TaxExemptionCategoryStepEditWrapped = wrapComponent(TaxExemptionCategoryStepEdit, 'TaxExemptionCategoryStepEdit');
const TaxExemptionCategoryStepViewWrapped = wrapComponent(TaxExemptionCategoryStepView, 'TaxExemptionCategoryStepView');

export {
    TaxExemptionCategoryStepEditWrapped, TaxExemptionCategoryStepViewWrapped
};
