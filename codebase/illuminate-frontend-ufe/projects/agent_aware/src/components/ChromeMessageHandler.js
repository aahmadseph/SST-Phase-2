/* eslint-disable no-console */
import { useEffect } from 'react';
import { useAgentAwareContext, useUserData } from 'hooks';
import { useChromeMessages } from 'hooks/useChromeMessages';

//This is a functional component to execute functions when we receive a specific message from chrome extension
//You can go to chrome-extension/background.js and use chrome.tabs.sendMessage to send a message
//Then you can handle the message in this component and execute logic
export const ChromeMessageHandler = () => {
    const { dispatch, updateUser } = useAgentAwareContext();
    const chromeMessage = useChromeMessages();

    useEffect(() => {
        if (chromeMessage.message === 'TabUpdated') {
            const localStorageUser = localStorage.getItem('UserData');

            if (localStorageUser) {
                const userData = useUserData();
                dispatch(updateUser(userData));
                localStorage.setItem('AgentAwareUserData', localStorageUser);
            }
        }
    }, [chromeMessage]);

    return null;
};
