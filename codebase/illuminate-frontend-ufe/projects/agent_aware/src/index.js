/* eslint-disable ssr-friendly/no-dom-globals-in-module-scope */
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'app';
import { useUserData } from 'hooks';

//This file injects a React Application on the Web Browser Tab Ids which background.js recognize as Agent Session.
//One thing to watch out is that this React App is injected when the page loads the first time.
//Every time the page has a hard reload the React App is deleted and a new one is created.
//SPA application changes will not create a new React App since they don't execute hard reload.
const isAppInserted = document.getElementById('agent-aware-app');

const userInfo = useUserData();

if (!isAppInserted && document && document.body && userInfo) {
    const agentInfo = document.createElement('div');
    agentInfo.id = 'agent-aware-app';
    document.body.prepend(agentInfo);

    //React application is initialized only when user data is available
    ReactDOM.render(React.createElement(App, {}, null), agentInfo);

    //Adding the global Sephora object to React Application context of execution
    window.addEventListener('message', e => {
        if (e.data?.type === 'SEPHORA_GLOBAL') {
            const sephoraGlobal = JSON.parse(e.data?.value);

            if (sephoraGlobal && sephoraGlobal.configurationSettings) {
                window.Sephora = sephoraGlobal;
            }
        }
    });
}
