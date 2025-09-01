import ReactDOM from 'react-dom';
import React, { useEffect } from 'react';
import Search from 'components/Search';
import { AddOrderNotesButton } from 'components/AddOrderNotesButton';
import { useAgentAwareContext } from 'hooks';
import { onRemoveDOMElement } from 'utils/observer';

const componentsToRender = {
    'agent-aware-basket-search': Search,
    'agent-aware-add-order-notes-button': AddOrderNotesButton
};

//This is a functional component that allows to inject specific components in specific UFE containers.
//To use please create a container inside a UFE component with some unique id
//Then add the custom Event when the component renders ej. window.dispatchEvent(new CustomEvent('AgentAwareContainerRendered', { detail: { id: 'agent-aware-basket-search' } }));
//Then add the same id in componentsToRender constant and its corresponding component to render
//This component will catch the event and render the component in dom with AgentAwareContext as props.
export const ComponentsInjection = () => {
    const agentAwareContext = useAgentAwareContext();

    const renderComponentInDom = (Component, id) => {
        const containerOfComponent = document.getElementById(id);

        if (containerOfComponent) {
            if (Component) {
                ReactDOM.render(React.createElement(Component, { ...agentAwareContext }, null), containerOfComponent);
                onRemoveDOMElement(containerOfComponent, () => ReactDOM.unmountComponentAtNode(containerOfComponent));
            }
        }
    };

    useEffect(() => {
        //Fallback when extension is injected to late
        Object.entries(componentsToRender).forEach(([componentId, Component]) => {
            renderComponentInDom(Component, componentId);
        });
        const addComponentInsideUFEContainer = e => {
            const componentToRender = componentsToRender[e.detail.id];

            if (componentToRender) {
                renderComponentInDom(componentToRender, e.detail.id);
            }
        };
        window.addEventListener('AgentAwareContainerRendered', addComponentInsideUFEContainer);

        return () => window.removeEventListener('AgentAwareContainerRendered', addComponentInsideUFEContainer);
    }, []);

    return null;
};
