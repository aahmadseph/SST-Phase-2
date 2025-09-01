const accessTokenName = 'AUTH_ACCESS_TOKEN';
import accessToken from 'services/api/accessToken/accessToken';
import refreshToken from 'services/api/accessToken/refreshToken';

export default {
    refreshToken: accessToken.withAccessToken(refreshToken.refreshToken, accessTokenName)
};
