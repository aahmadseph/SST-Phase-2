import { useEffect, useState } from 'react';

//This custom hook returns the messages sended from background.js and save it.
//To handle the message please use the ChromeMessageHandler component
export const useChromeMessages = () => {
    const [message, setMessage] = useState({ message: '' });

    const addNewMessage = newMessage => setMessage(newMessage);

    useEffect(() => {
        /* eslint-disable no-undef */
        chrome.runtime.onMessage.addListener(addNewMessage);

        /* eslint-disable no-undef */
        return () => chrome.runtime.onMessage.removeListener(addNewMessage);
    }, []);

    return message;
};
