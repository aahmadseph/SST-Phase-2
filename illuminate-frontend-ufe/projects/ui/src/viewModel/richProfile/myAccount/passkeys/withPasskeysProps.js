import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { createStructuredSelector } from 'reselect';

import { passkeysSelector } from 'selectors/passkeys/passkeysSelector';
import { hasIdentitySelector } from 'selectors/auth/hasIdentitySelector';

const { wrapHOC } = FrameworkUtils;

const withPasskeysProps = wrapHOC(
    connect(
        createStructuredSelector({
            passkeys: passkeysSelector,
            hasIdentity: hasIdentitySelector
        })
    )
);

export { withPasskeysProps };
