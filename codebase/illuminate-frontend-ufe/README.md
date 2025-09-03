![Sephora](https://www.sephora.com/img/ufe/logo.svg)

# Table of contents

-   [Welcome Fullstack Engineers - All you need to know to get started](./documentation/fullstack.md)
-   [How to setup new computer for work](./documentation/environment.md)
-   [Coding standards](#coding-standards)
    -   [actions](./projects/ui/src/actions/README.md)
    -   [component](./projects/ui/src/components/README.md)
    -   [hocs](./projects/ui/src/hocs/README.md)
    -   [reducers](./projects/ui/src/reducers/README.md)
    -   [selectors](./projects/ui/src/selectors/README.md)
    -   [viewModel](./projects/ui/src/viewModel/README.md)
    -   [framework](./projects/ui/src/utils/framework/README.md)
-   [Code review standards](#code-review-standards)
-   [Helpful docs to on-board](#helpful-docs-to-on-board)
-   [SDL Merge Process](#sdl-merge)

# How to setup new computer for work

You can find detailed explanation [here](./documentation/environment.md).

# Best Practices

**Don't use browser APIs server side** - Window and document are not available in node, and many other variables that are typically available in the browser which are attached to window also aren't available. Common examples include: location, navigator, localStorage. It is a common error to try to access these variables in selectors or render functions. This will cause an error in the server side render which may not be obvious working in front-end mode but will impact the production build and break the server side rendering of the page. The best way to avoid this issue is to access browser APIs in the component lifecycle functions like componentDidMount() or componentDidUpdate(). Avoid using isNodeRender as it causes react hydration issues. There is more on that below.

**Limit Usage of setState() for animation / interactivity** - setState will activate the react rendering process. This process is fast, but not fast enough to run 60 times a second. Anything that happens in real time should avoid using set state and edit the HTML component properties directly. Events that fire many times a second include resize, scroll, touchmove, mousemove or setInterval.

-   Don’t use setState in any animation. setState always triggers the react render process, even if nothing has changed. The react render process is not fast enough to be used in this way.
-   Always use CSS animations when possible. CSS animations can be triggered with a state change if needed but in general its better to avoid using state at all when animating. https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations
-   If you need to create a real-time interactive animation that can’t be handled with a predetermined css animation use requestAnimationFrame(). https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
-   You can still use CSS animation with emotion.

**Be aware how often setState is called, especially on page load** - setState will set in motion the react rendering process. As a general rule of thumb the higher up in the DOM the setState occurs the more render time will be needed. Never put a setState in any kind of loop, see the rule directly above this one. Try to avoid calling setState during page load. Avoid calling setState as a result of an API call. Try to update the DOM in groups so that all the setStates are run at the same time. This will help avoid style recalculations. If the same setState is called multiple times use shouldComponentUpdate(), see the rule below. You can check how often your setState is called on page load by putting a stop point on the call.

**Be aware data flow from the store, especially on page load** - Updateing the store will trigger the react rendering process. Generally spearking the higher up in the DOM the prop update occurs the more render time will be needed. Avoid cascading and looping rerenders that may occur as a result of triggering an update to the store as part of a response to a previous update. Try to group updates to the store together so that DOM updates are limited. Remember to use selectors to memoize props and avoid unnessesarry rerenders.

If you have a parent and child both listening to the same part of the store and then you update the child from the parent by passing props derived from the shared store data you will cause the child to render twice unnecessarily. Don't do this. Either pass all the data from the parent or remove the derived values from the props passed to the child. A shared selector should be able to fix this issue.

**Debounce repetitive events** - Many events, such as scroll and resize will fire their event handler many times a second. If you need to listen for one of these events, but its not necessary to react to them in real time use the debounced version of the event. There is already a DebouncedScroll, if any other debounce events are needed they can also be built into Events.js.

**Run render analysis regularly to check page performance** - This can be done with `Sephora.Util.Perf.logRenderPerf()`. You can run it at any time in the console, as long as you are configured for frontend development. If you want to get consistent results from one refresh to another uncomment the call to logRenderPerf() in services/postload.js. This will post the render time data at postload when most of the page processes have completed.

First check to see if your component is rendering as often as you expected. If the component is rendered only on the server side you won't see it in this list (that's a good thing!). Every component with a controller or that is the child of component with a controller will be rendered at least once when the controllers are first applied to the components. So if your component listens for an update from the store that happens after the controllers are applied then your component will render twice. Our page loading process is highly asynchronous so you could end up with different results depending on how the page assets load with any given refresh.

Second, check the "renderTime" column. Every time a component's render function is run its time is recorded and added to its total render time, which is the value seen in this column. Typically this should be a very small number(less than 10ms) unless your component is repeated hundreds or thousands of times.

Third, check the "inclusiveRenderTime". This columns adds together the component's render time, plus all its child components and the time taken by react's internal processes together. The higher up the component is in the DOM the higher its inclusiveRenderTime will be. Sorting by this column is a good way to check the performance of your higher level components. If you see a high value in this column and your component is being rendered more times than you expected this could be an ideal candidate for optimization. Unfortunately this is not currently working for functional components.

You can also execute `Sephora.Util.Perf.getSummary()` to get a log of all the events in order and which time they executed, and also `Sephora.Util.Perf.getMeasurements()` which expresses the deltas between each related event.

**Use this.state only for variables that change the template** - Not all component variables will affect how a component appears. By running setState you are triggering the react rendering process. If the variable you are changing won't actually have any affect on the component HTML/CSS then it's better to attach it to the component instance directly, e.g. `this.property = x` rather than `this.setState({property:x})`.

**Basic List Components / Keys**

Warning: by avoiding the usage of keys we would end up dealing with unpredictable render behaviors. Read more.
Regularly we render lists inside components, the `key` prop helps React identify which items have to be modified, added or deleted. “The best way to pick a key is to use a string that uniquely identifies a list item among its siblings. Most often you would use IDs from your data as keys”.

Some rules:

Keys only make sense in the context of the surrounding array.
The best way to pick a key is to use a string that uniquely identifies a list item among its siblings. Most often you would use IDs from your data as keys.
Keys used within arrays should be unique among their siblings. However, they don’t need to be globally unique.
When you don’t have stable IDs for rendered items, you may use the item index as a key as a last resort.

-> React's documentation.

**Avoid switching native element types high up in the DOM tree** - It causes the whole subtree to be removed and re-rendered by react.

**Don't use React.cloneElement() to modify component props** - This causes a lot of additional react render time overhead that isn't necessary. Use a render function instead. https://frontarm.com/james-k-nelson/passing-data-props-children/

## Redux

**Use generic merge reducer whenever possible** - This is a performance optimization. It helps keep the size of our action/reducer code to a minimum. It also reduces the number of cases in the reducers switch statements, which can also become a performance bottleneck.

**Component State Management** - Best practices can be found in the component section at Data Flow Best Practices.

## Other

**Avoid page jumping** - If the dimensions of the component are predictable use CSS to set the width/height so that its space is already taken up on the page and doesn't cause other components to jump when rendered. Generally speaking it's best to render as much of the component template as possible on the server. Below is a list of things that will keep part or all of a template from rendering server side:

-   If part of a template is only shown based on the value of a variable that is only set on the client side. This is mostly likely to happen because the template has something like "this.props.property ? <Component> : null", and the controller sets this.props.property by listening to the store.
-   Part of the template displays conditionally based on the value of a global variable that doesn't exist server side. Window and document are not available in node, and many other variables that are typically available in the browser which are attached to window also aren't available. Common examples include: location, navigator, localStorage. Most of the properties attached to the global "Sephora" variable are available in both client and server, but not all.

**Personalized Data** - All personalized data is retrieved through the UserInfo called made by the browser so that the page can be cached in Akamai. When LOEing a component make sure to take into account whether or not it contains personal data. If it does some additional front end work may need to be done to support it. In addition API and BE stories may also need to be written in order to support the component. All personalized data needs to be removed from the data sent to node. It may also need to be added to the UserInfo call, or have support build for an additional API endpoint.

**Check console log before committing** - Always test that your fix works and hasn't broken anything else before committing. This includes checking the error logs for any new errors and investigating them even if everything seems to be working.

**Utility functions should be isomorphic** - This isn't always necessary, some functionality will only ever run in the browser. Generally, however when a utility function is made the implication is that it will work across the framework. If you're creating a utility function consider what would happen if someone called it server side rather than in the client. Node doesn't support some of the function typically found in the browser, such as the window and document object. You can check if the code is being run server side by using Sephora.isNodeRender. isNodeRender can cause react hydration issues. There is more on that below.

**Coordinate utility functions and low level code across branches** - Several of our branches are developed over the course of many sprints in isolation but still have code that ultimately we will want to be shared. In most of these cases these changes can be built in master, or merged back to master from the feature branch. If the update affects code that is already in place, or is high risk for any reason it can also be developed in its own branch which is then merged with any feature branches dependent on it.

**Don’t add new packages without checking their impact on the JS bundles** - When you add a new module please send out a team wide email explaining what you've added, why it's necessary and how much size it adds to JS bundle file sizes. This will help people to remember to npm install when they take an update as well. You can check how many bytes the module has added to our JS packages by running the isomorphic build (`npm run webpack`) or by using `npm run build-analyse` and looking at UFE > Logs > statistics.html. You can read more about how the bundles works here: Dependency Management & Build#CodeSplitting.

**Run "npm ci" regularly** - When our code is built on the server the most recent version of all our packages is installed since it is doing a fresh install every time. This doesn't apply when you're working locally so over time modules in package.json with settings like "^2.79.0" will eventually be out of date. Running npm update often will ensure that the version of the module you are running is the same locally and on the server.

**:hover is better than mouseover** - If possible always use CSS :hover over mouseover. The use of mouseover will be much slower because it will have to trigger the react render process, it also forces the component to be rendered client side which adds additional rendering during page load as well as adding to the overall page size.

**Page content should be passed in the component props or store not from a media ID** - The fastest way to render a component in on the backend. Even components that are dependent on user data will render faster if their props are passed in the page JSON. Making mediaID calls adds a lot of additional load to our servers and will cause performance issues on mobile. The only exception to this is if the media ID content is very large and appears on high traffic pages. In this case the data can be stored in local storage as we do with the shop categories.

**Don't use isNodeRender to show/hide content in selectors or a component's render function** - This is because react expects the component HTML to be the same when the page is rendered server side and when it is "hydrated" client side. If that is not the case the react component being rendered is often broken, and so are any sibling components it may have. isNodeRender can only be used after a component has hydrated, for example in the componentDidMount() function.

**Avoid renaming components** - The automated testing team uses component names to target HTML elements in their automated testing. Renaming components may break there tests. If you need to rename a component notify QA as soon as possible.

# Coding Standards

-   MR should have `Delete source branch when merge request is accepted.` accepted by default.
-   Please, use jira ID as a branch name like: `git checkout -b UA-1095`.
-   Git commit message and MR title should be the same. Use this mask: `[JIRA-#] Jira title goes here`. Example: `[UA-1095] Localization resource file should be required right before usage and not earlier`. For git commit message use JIRA title unless it meaningless then you may provide your own.
-   When you want to create a new file or folder, please, follow `camelCase` naming convention. Exceptions are files for classes, react components and folders for react components.

-   There should be nothing going after `module.exports` statement in a file. One empty line should be before and after it.
-   `module.exports` statement should not contain any implementation details.

More standards are defined within ESLint rules. An ESlint check is run on every commit to ensure that the style is not violated. Please refer to the `.eslintrc` configuration file to learn more.

Also, please, read and follow additional coding standards for folders:

-   [actions](./projects/ui/src/actions/README.md)
-   [component](./projects/ui/src/components/README.md)
-   [hocs](./projects/ui/src/hocs/README.md)
-   [reducers](./projects/ui/src/reducers/README.md)
-   [selectors](./projects/ui/src/selectors/README.md)
-   [viewModel](./projects/ui/src/viewModel/README.md)
-   [framework](./projects/ui/src/utils/framework/README.md)

# Code review standards

If you are going to approve MR, please, check it against this list at minimum.

-   GitHub MR should have this option enabled: `Delete source branch when merge request is accepted.`
-   Make sure that git history was not lost after renaming file(s).
-   Check that the target branch is correct and based on the `fix version` of the story/task/bug and that can change depending if sprint end has already occurred and dev code is already merged to master.
-   For SDL MRs check if we are not re-introducing files that got deleted or moved.
-   Check that only absolute paths were used.
-   Make sure that named export was used everywhere except react components and files with class definition.
-   Make sure that all files and folders inside `selectors` and `vieModel` folders were created using `camelCase` naming convention.
-   Check that new component was created within the new folder with the same name and `index.js` file was created too.
-   Make sure that selectors within the `projects/ui/src/selectors/` folder do not use any other helper functions and only read and return raw data from redux store without any transformation(s).
-   Reusable selectors with data transforms should be created within the `projects/ui/src/viewModel/selectors/` folder. If selector with a data transform is used only once within the HOC then it has to be defined in the same HOC's file.
-   Check for unit tests and if they are covering the core logic correctly.

# Helpful docs to on-board

-   [Acronyms](https://confluence.sephora.com/wiki/pages/viewpage.action?spaceKey=ILLUMINATE&title=Sephora+Glossary)
-   [On-boarding](https://confluence.sephora.com/wiki/display/FEE/On-boarding)
-   [UFE Documentation](https://confluence.sephora.com/wiki/pages/viewpage.action?pageId=154232894)
-   [Branching Strategy](https://confluence.sephora.com/wiki/display/FEE/UFE+Branching+Strategy)
-   [Team Jira Board](https://jira.sephora.com/secure/RapidBoard.jspa?rapidView=359&view=planning.nodetail)
-   [Test Data Payments](https://confluence.sephora.com/wiki/display/QA/eStore-FE+Test+Data+-+Payments)
-   [Tech Talks Archives](https://confluence.sephora.com/wiki/display/FEE/Tech+Talks+-+Thursday+Framework+Sessions)
-   [UFE Project Read Me](https://github.com/Sephora-US-Digital/illuminate-frontend-ufe/blob/dev/README.md)
-   [Domain Knowledge](https://confluence.sephora.com/wiki/display/FEE/Domain+Knowledge)
-   [UFE Teams](https://confluence.sephora.com/wiki/display/FEE/UFE+Team+Notes)

# SDL Merge

We receive SDL translation bundles Tuesday and Thursday night PST hours to \_SDL branches.
Example: dev_ufe_SDL
We need to merge received SDL branches to UFE branches twice a week (Merge dev_ufe_SDL to dev)

-   Wednesday PST hours morning - noon
-   Friday PST hours morning - noon

Sample Prod Support JIRA [UA-1349 ](https://jira.sephora.com/browse/UA-1349)
Clone this JIRA for every sprint and create respective subtasks for SDL merge days in that sprint.

STEPS TO MERGE SDL BRANCHES:

----------------------------

The below steps are for 'dev' branch, exact same steps to be followed for all the branches listed in [SDL Properties file](https://github.com/Sephora-US-Digital/illuminate-SDL/blob/master/SDL_UFE_Branches.properties).

Before you start, first resolve any auto merge failures dev -> dev_ufe_SDL or respective feature branch -> feature branch SDL.
[dev -> dev_ufe_SDL automerge](https://jenkins.lipstack.sephoraus.com/view/merge/job/github-automerge_ufe_dev-to-dev_ufe_SDL/)

1. Compare the branches by initiating a merge request on git. source branch 'dev_ufe_SDL'. Target branch 'dev'. Click 'Compare branches and continue'. Look for 'Changes' in the bottom.

2. The only changed files should be \*\_fr_CA.js files. If no new keys are added/deleted, only values are changed with french translations, then directly create this MR 'dev_ufe_SDL' to 'dev'.

3. If there are changes to files other than fr_CA, then create a temporary branch in your local environment from 'dev' and take only fr_CA changes from SDL branch. Push this temporary branch to origin to create MR against 'dev'.

4. If any new keys get added/deleted, then compare with respective \*en*US.js \_\_ files.{*} The number of keys in fr_CA should be same as en_US. If any keys are getting missed by this merge, copy the keys from US files with english version. They get translated to french in next builds.

[Video recording workout session with an example](https://urldefense.com/v3/__https://sephora.zoom.us/rec/share/pe7KiZ-8IjKvNyYBPXkpX9W8Ycvz9rdVpfLM0eNgceZBCjAUws0JFJJ7wCJUXixp.7S3JwNW2mGUp-j6L__;!!Lt0KOR8!CXlIusmJ6FBlDGmS_ooQGTNpn-nZT3vuPJAxd9Q1OQ-bR74Hc11te9_1v8X9fZ7iAwpqhrXZ$) 
Passcode: %4EyM1nt

[Tech talk](https://sephora.zoom.us/rec/share/0e8BG_K3Fp2tswiM5XMhc4zHfgc8DuH710d_DWRw7XvhGqgjrgloJtbcBygcagbe.MTtaHNhj277TnCEl)
Passcode: h2Y$DQFA
