import React from 'react';
import { AgentAwareContext } from 'context/AgentAwareContext';

export const useAgentAwareContext = () => {
    const agentAwareContext = React.useContext(AgentAwareContext);

    return agentAwareContext;
};
