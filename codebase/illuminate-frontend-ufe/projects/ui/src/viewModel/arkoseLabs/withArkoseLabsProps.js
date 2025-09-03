import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';
import FrameworkUtils from 'utils/framework';
import cookiesUtils from 'utils/Cookies';
import cryptoUtils from 'utils/Crypto';
import userUtils from 'utils/User';

const { wrapHOC } = FrameworkUtils;
const {
    KEYS: { SEPH_SESSION }
} = cookiesUtils;

// Uncomment line below if you want to force enable ArkoseLabs integration. Do it for local development only!!!
// Sephora.configurationSettings.isArkoseLabsIntegrationEnabled = true;

const fields = createSelector(
    userSelector,
    (_state, ownProps) => ownProps.publicKey,
    (user, key) => {
        const publicKey = key || Sephora.configurationSettings.arkoseLabsPublicKey;
        const { profileId } = user;
        const isAnonymous = userUtils.isAnonymous(user);
        let id;

        if (isAnonymous) {
            let sephSession = cookiesUtils.read(SEPH_SESSION);

            if (!sephSession) {
                sephSession = cryptoUtils.createRandomUUID();
                cookiesUtils.write(SEPH_SESSION, sephSession, 730);
            }

            id = sephSession;
        } else {
            id = profileId || publicKey;
        }

        return { id, publicKey };
    }
);

const withArkoseLabsProps = wrapHOC(connect(fields));

export {
    fields, withArkoseLabsProps
};
