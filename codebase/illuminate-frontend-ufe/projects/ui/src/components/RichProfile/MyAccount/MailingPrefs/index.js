import MailingPrefs from 'components/RichProfile/MyAccount/MailingPrefs/MailingPrefs';
import { withMailingPreferencesProps } from 'viewModel/richProfile/myAccount/mailingPrefs/withMailingPreferencesProps';

const ConnectedMailingPrefs = withMailingPreferencesProps(MailingPrefs);

export default ConnectedMailingPrefs;
