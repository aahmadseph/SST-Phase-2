# CSC Agent Aware Site

## Agent Aware React APP Folder (ufe/agent-aware)

### Adding independent functionalities to AgentAware which doesnt exist on the site.(Example: the top banner)

-   Go to Agent Aware React App
-   Inside src create your component.

#### Insert totally independent new components and elements in existing UFE DOM. (Example Search in Basket Page)

-   Go to UFE code and add a container element in which the component should render. Assign the same ID as the agent-aware-app.
-   In the UFE component add a Custom Event that notifies the extension that a container for a component is being rendered.
    Example of UFE code for component:

```
UFECODE---
//Notify AgentAware Chrome extension that a container for AgentAwareComponents was rendered.
window.dispatchEvent(new CustomEvent('AgentAwareContainerRendered', { detail: { id: 'agent-aware-basket-search' } }));

return (
    UFECODE---
        <div id='agent-aware-basket-search'></div>
    UFECODE---
)
```

Now

-   Create the component you need to insert inside agent-aware app (not UFE CODE).
-   Go to ComponentsInjection file and add the id of the component and the component to render in `componentsToRender` variable.

Extension will catch this event and render the component you need inside the container.

### When you need to access Redux store or add a class or a container to modify styles and insert components into the DOM.

-   wrap all your code with the `if(Sephora.isAgent)` flag. (This is always false for the dotcom site.)
    if (Sephora.isAgent) {
    }

### Miscellaneous

1. Add an additional CSS file to the document to apply styles to Sephora.com. Follow the steps below to achieve this:

-   Go to `agent-aware/chrome-extension/styles.css`, and add the class or target the elements that you need to modify.
-   Go to the UFE code and add the class that you created to the elements you need to target..
-   You will see that when the extension is loaded and turned on, the new styles will be applied to the elements in the DOM.

2. Receive notifications of events that happen in the Chrome Web Browser, such as requests on the fly, tab updates, and so on.

To achieve this, refer to the documentation at https://developer.chrome.com/docs/extensions/mv3/messaging/. The service worker file is background.js, and the component that receives the messages is ChromeMessageHandler inside the agent-aware-app.

For more functionalities please check https://developer.chrome.com/docs/extensions/reference/

### To Publish to Chrome store

-   Create a jira for the preparation, similar to this one https://jira.sephora.com/browse/ECSC-827
-   go to https://chrome.google.com/webstore/devconsole and login with your credential.
-   make sure you switch to Sephora US profile
-   publish in Chrome store. (Max take up to 3 days to get response from google and we get 30 days to make a change)

### How to install Chrome extension in your browser

https://confluence.sephora.com/wiki/pages/viewpage.action?pageId=309046336

### To run UFE code base local as AgentAwareSite

1.) `npm run webpack-aas` (To run in isomorphic mode)

2.) `npm run webpack-frontend-aas`(To run in frontend mode)

3.) `bash tools/run.sh --frontend --agent-aware`

4.) `sudo bash tools/router.sh --agent-aware --profile=qa2`

These steps will create a new agent/bundle where the `Sephora.isAgent` flag is true, and will use that bundles instead of normal isomorphic bundles.

### To modify Agent Aware React App inside agent-aware folder

1.) Run `npm run extension:chrome` to create the `content.js` bundle

2.) Load `agent-aware/chrome-extension` folder to the extensions in Chrome web browser as unpacked.

1.) Modify the app as you wish and apply the step 1 again.

3.) Reload the chrome extension in the web-browser

### To see extension working in local.sephora.com

1.) Add `agenttier=1` in Web browser tab session storage

2.) go to `agent-aware/chrome-extension/background.js` and in the initial storage (first `chrome.storage.local.set`) assign a agenttier value (1,2,3) and a sessionId (the tab id in which you are working locally)

You can get the `tabId` creating a console in `background.js/chrome.tabs.onUpdated.addListener` function.
This console can be checked when the tab is updated, in the Chrome web browser/manage-extensions and clicking in the service worker of the extension.
