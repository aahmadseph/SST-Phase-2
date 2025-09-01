import React from 'react';
import { useAgentAwareStore } from 'hooks';
import actions from 'actions/actions';

export const AgentAwareContext = React.createContext();

//This provider holds all the state of the Agent Aware application and share it between components
//To use this provider you can use the custom hook hooks/useAgentAwareContext
//This provider will give you the state of application, dispatch funcion and respective actions
export const AgentAwareProvider = ({ children }) => {
    const agentAwareStore = useAgentAwareStore();

    return (
        <AgentAwareContext.Provider
            value={{
                ...agentAwareStore,
                ...actions
            }}
        >
            {children}
        </AgentAwareContext.Provider>
    );
};
