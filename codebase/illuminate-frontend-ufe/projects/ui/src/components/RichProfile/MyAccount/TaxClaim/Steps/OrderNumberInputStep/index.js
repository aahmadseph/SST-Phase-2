import {
    OrderNumberInputStepEditWrapped,
    OrderNumberInputStepViewWrapped
} from 'components/RichProfile/MyAccount/TaxClaim/Steps/OrderNumberInputStep/OrderNumberInputStep';
import { withOrderNumberInputProps } from 'components/RichProfile/MyAccount/TaxClaim/Steps/OrderNumberInputStep/withOrderNumberInputProps';

const ConnectedOrderNumberInputEditStep = withOrderNumberInputProps(OrderNumberInputStepEditWrapped);
const ConnectedOrderNumberInputViewStep = withOrderNumberInputProps(OrderNumberInputStepViewWrapped);

export default {
    ConnectedOrderNumberInputEditStep,
    ConnectedOrderNumberInputViewStep
};
