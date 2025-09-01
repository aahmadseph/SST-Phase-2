import React, { useEffect } from 'react';
import Customer from 'components/Customer';
import { AgentAwareProvider } from 'context/AgentAwareContext';
import { ComponentsInjection } from 'components/ComponentsInjection';
import { ChromeMessageHandler } from 'components/ChromeMessageHandler';
import { ModalsProvider } from 'components/ModalsProvider';
import { UfeBackendErrorsHandler } from 'components/UfeBackendErrorsHandler';
import { fetchConfig } from './utils/api';

function App() {
    useEffect(() => {
        if (!window.Sephora?.configurationSettings) {
            fetchConfig();
        }
    }, []);

    return (
        <AgentAwareProvider>
            <Customer />
            <ComponentsInjection />
            <ChromeMessageHandler />
            <UfeBackendErrorsHandler />
            <ModalsProvider />
        </AgentAwareProvider>
    );
}

export default App;
