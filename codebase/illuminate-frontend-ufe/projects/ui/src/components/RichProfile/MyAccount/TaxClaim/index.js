import TaxClaim from 'components/RichProfile/MyAccount/TaxClaim/TaxClaim';
import { withTaxClaimProps } from 'viewModel/richProfile/myAccount/taxClaim/withTaxClaimProps';

const ConnectedTaxClaim = withTaxClaimProps(TaxClaim);

export default ConnectedTaxClaim;
