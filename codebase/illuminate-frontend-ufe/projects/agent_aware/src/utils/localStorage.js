export const getItem = item => {
    return localStorage.getItem(item);
};

export const flush = () => {
    // User
    localStorage.removeItem('UserData');
    localStorage.removeItem('AgentAwareUserData');
    localStorage.removeItem('realtimePrescreen');
    localStorage.removeItem('ccTargeters');
    localStorage.removeItem('jwtAuthToken');

    // Authentication Tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Basket
    localStorage.removeItem('basket');
};
