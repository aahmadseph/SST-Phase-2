import {
    UploadDocumentsStepEditWrapped,
    UploadDocumentsStepViewWrapped
} from 'components/RichProfile/MyAccount/TaxClaim/Steps/UploadDocumentsStep/UploadDocumentsStep';
import { withUploadDocumentsProps } from 'viewModel/taxClaim/withUploadDocumentsProps';

const ConnectedUploadDocumentsEditStep = withUploadDocumentsProps(UploadDocumentsStepEditWrapped);
const ConnectedUploadDocumentsViewStep = withUploadDocumentsProps(UploadDocumentsStepViewWrapped);

export default {
    ConnectedUploadDocumentsEditStep,
    ConnectedUploadDocumentsViewStep
};
