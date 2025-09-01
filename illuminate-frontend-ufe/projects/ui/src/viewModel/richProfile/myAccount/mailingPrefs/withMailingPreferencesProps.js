import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { mailingPreferencesSelector } from 'selectors/mailingPreferences/mailingPreferencesSelector';
import { fetchAndStorePreferences } from 'actions/MailingPreferencesActions';
import { userSelector } from 'selectors/user/userSelector';
import { authSelector } from 'selectors/auth/authSelector';

const { wrapHOC } = FrameworkUtils;

// Map the fields to props
const fields = createStructuredSelector({
    mailingPreferences: mailingPreferencesSelector,
    user: userSelector,
    auth: authSelector
});

// Map functions to props
const functions = {
    fetchAndStorePreferences
};

const withMailingPreferencesProps = wrapHOC(connect(fields, functions));

export {
    fields, withMailingPreferencesProps
};
