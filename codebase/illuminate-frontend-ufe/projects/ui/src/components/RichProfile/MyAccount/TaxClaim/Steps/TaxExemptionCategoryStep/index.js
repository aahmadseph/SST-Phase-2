import {
    TaxExemptionCategoryStepEditWrapped,
    TaxExemptionCategoryStepViewWrapped
} from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionCategoryStep/TaxExemptionCategoryStep';
import { withTaxExemptionCategoryProps } from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionCategoryStep/withTaxExemptionCategoryProps';

const ConnectedTaxExemptionCategoryEditStep = withTaxExemptionCategoryProps(TaxExemptionCategoryStepEditWrapped);
const ConnectedTaxExemptionCategoryViewStep = withTaxExemptionCategoryProps(TaxExemptionCategoryStepViewWrapped);

export default {
    ConnectedTaxExemptionCategoryEditStep,
    ConnectedTaxExemptionCategoryViewStep
};
