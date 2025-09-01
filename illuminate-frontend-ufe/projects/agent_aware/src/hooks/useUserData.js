import { getItem } from '../utils/localStorage';

export const useUserData = () => {
    const agentAwareUserData = getItem('AgentAwareUserData');

    if (agentAwareUserData) {
        return JSON.parse(agentAwareUserData);
    }

    const userData = JSON.parse(getItem('UserData'));

    return userData;
};
